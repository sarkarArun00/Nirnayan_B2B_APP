import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GlobalStyles } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ClientService from '../../services/client_service';
import { pick, types } from '@react-native-documents/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

// Base URL used to build full image links from "filePath"
const FILE_BASE_URL = 'https://lims-testing-api.nirnayanhealthcare.com/';

// "Mark as Closed" button is HIDDEN for these statuses
// (written without spaces/underscores: IN_PROGRESS -> INPROGRESS)
const HIDE_CLOSE_BTN_STATUSES = ['REOPENED', 'INPROGRESS', 'CLOSED'];

// Max files per comment
const MAX_FILES = 5;

const buildFileUrl = path => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return FILE_BASE_URL + String(path).replace(/^\/+/, '');
};
const isImage = file => String(file?.fileType || '').startsWith('image/');

const formatDate = value => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Accepts either [ ...list ] or { status, data: [ ...list ] }
const extractList = res =>
  Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];

const isOk = res => Array.isArray(res) || res?.status === 1;

// IN_PROGRESS -> In Progress
const prettyStatus = v =>
  String(v || '')
    .toLowerCase()
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// Guess mime type from file name when picker does not give one
const guessMime = name => {
  const ext = String(name || '')
    .split('.')
    .pop()
    .toLowerCase();
  const map = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    txt: 'text/plain',
    csv: 'text/csv',
  };
  return map[ext] || 'application/octet-stream';
};

// camera / gallery / document picker result -> { uri, type, fileName }
const toUploadFile = f => {
  const fileName = f.fileName || f.name || `file_${Date.now()}`;
  return {
    uri: f.uri,
    type: f.type || guessMime(fileName),
    fileName,
  };
};

// Maps the camelCase detail API response to the field names the UI uses
const normalizeTicket = t => {
  if (!t) return {};
  const mapped = {
    ...t,
    ticket_no: t.ticket_no ?? t.ticketNo,
    subject_name: t.subject_name ?? t.subject?.name,
    created_at: t.created_at ?? t.createdAt,
    updated_at: t.updated_at ?? t.updatedAt,
    created_by: t.created_by ?? t.createdBy,
    created_by_name:
      t.created_by_name ?? t.createdByName ?? t.createdByUser?.name,
    assignee_name:
      t.assignee_name ??
      t.assignedUser?.name ??
      t.assignedUser?.fullName ??
      t.assignedUser?.username,
  };
  // drop null/undefined so they don't overwrite values already known from the list
  return Object.fromEntries(
    Object.entries(mapped).filter(([, v]) => v !== null && v !== undefined),
  );
};

function TicketDetails({ navigation, route }) {
  const { ticketId, ticketNo, ticket: routeTicket } = route?.params || {};

  const [ticket, setTicket] = useState(normalizeTicket(routeTicket));
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  // Comment form (shared by the main section preview and the modal)
  const [commentText, setCommentText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showSourceSheet, setShowSourceSheet] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusAction, setStatusAction] = useState(null); // 'close' | 'reopen' | null
  const [commentsModal, setCommentsModal] = useState(false);
  const commentsScrollRef = useRef(null);

  // Image viewer
  const [showViewer, setShowViewer] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchTicketDetails = useCallback(async () => {
    if (!ticketId) return;
    try {
      setLoading(true);
      setError('');

      // Call all APIs together
      const [detailRes, commentsRes, historyRes] = await Promise.allSettled([
        ClientService.getTicketById(ticketId),
        ClientService.getComments(ticketId),
        ClientService.getTicketHistory(ticketId),
      ]);

      // 1) Ticket details
      if (detailRes.status === 'fulfilled' && detailRes.value?.status === 1) {
        const data = detailRes.value.data;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setTicket(prev => ({ ...prev, ...normalizeTicket(data) }));
        }
      } else {
        setError(detailRes.value?.message || 'Unable to load ticket details');
      }

      // 2) Comments
      if (commentsRes.status === 'fulfilled' && isOk(commentsRes.value)) {
        setComments(extractList(commentsRes.value));
      } else {
        setComments([]);
      }

      // 3) History
      if (historyRes.status === 'fulfilled' && isOk(historyRes.value)) {
        setHistory(extractList(historyRes.value));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.log('Fetch Ticket Details Error:', e);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  /* ----------------------------- ATTACHMENTS ----------------------------- */

  const showSettingsAlert = message => {
    Alert.alert('Permission required', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  };

  const requestCameraPermission = async () => {
    // iOS asks automatically (needs NSCameraUsageDescription in Info.plist)
    if (Platform.OS !== 'android') return true;
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Allow the app to use your camera to attach photos.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        showSettingsAlert(
          'Camera permission is blocked. Please enable it from app settings.',
        );
      } else {
        Alert.alert('Permission denied', 'Camera permission is required.');
      }
      return false;
    } catch (e) {
      console.log('Camera permission error:', e);
      return false;
    }
  };

  const addFiles = list => {
    const normalized = (list || []).filter(f => f?.uri).map(toUploadFile);
    if (!normalized.length) return;

    const room = MAX_FILES - attachedFiles.length;
    if (room <= 0) {
      Alert.alert('Limit reached', `You can attach up to ${MAX_FILES} files.`);
      return;
    }
    setAttachedFiles(prev => [...prev, ...normalized.slice(0, room)]);
    if (normalized.length > room) {
      Alert.alert('Limit reached', `Only ${MAX_FILES} files are allowed.`);
    }
  };

  const removeFile = index => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // react-native-image-picker result (camera + gallery)
  const handleImagePickerResult = result => {
    if (!result || result.didCancel) return;

    if (result.errorCode) {
      if (result.errorCode === 'permission') {
        showSettingsAlert(
          'Permission is blocked. Please enable it from app settings.',
        );
      } else {
        Alert.alert('Error', result.errorMessage || 'Unable to pick file');
      }
      return;
    }
    addFiles(result.assets);
  };

  // iOS cannot present a picker on top of an open <Modal>,
  // so close the comments modal first and reopen it afterwards.
  const runPicker = async pickerFn => {
    setShowSourceSheet(false);
    const isIOS = Platform.OS === 'ios';

    if (isIOS) {
      setCommentsModal(false);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    try {
      await pickerFn();
    } catch (e) {
      console.log('Picker Error:', e);
    } finally {
      if (isIOS) setCommentsModal(true);
    }
  };

  const handleCamera = () =>
    runPicker(async () => {
      const allowed = await requestCameraPermission();
      if (!allowed) return;

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.7,
        saveToPhotos: false,
      });
      handleImagePickerResult(result);
    });

  const handleGallery = () =>
    runPicker(async () => {
      const room = Math.max(1, MAX_FILES - attachedFiles.length);
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
        selectionLimit: room,
      });
      handleImagePickerResult(result);
    });

  const handleDocument = () =>
    runPicker(async () => {
      try {
        const result = await pick({
          type: [types.allFiles],
          allowMultiSelection: true,
          mode: 'import',
        });
        addFiles(result);
      } catch (e) {
        if (e?.code !== 'OPERATION_CANCELED') {
          console.log('File Picker Error:', e);
          Alert.alert('Error', 'Unable to pick file');
        }
      }
    });

  /* ------------------------------ ADD COMMENT ----------------------------- */

  // Add comment -> then reload comments
  const handleSendComment = async () => {
    const text = commentText.trim();
    if ((!text && attachedFiles.length === 0) || sending) return;

    try {
      setSending(true);

      const addRes = await ClientService.addComment({
        ticketId,
        comment: text,
        attachments: attachedFiles, // [{ uri, type, fileName }]
      });

      if (addRes?.status === 1) {
        setCommentText('');
        setAttachedFiles([]);

        const commentsRes = await ClientService.getComments(ticketId);
        if (isOk(commentsRes)) {
          setComments(extractList(commentsRes));
        }
      } else {
        Alert.alert('Error', addRes?.message || 'Unable to add comment');
      }
    } catch (e) {
      console.log('Add Comment Error:', e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  /* --------------------------- CLOSE / REOPEN ---------------------------- */

  const runStatusAction = async (type, apiCall, nextStatus) => {
    if (statusAction) return;
    try {
      setStatusAction(type);
      const res = await apiCall(ticketId);

      if (res?.status === 1) {
        // Update buttons immediately, then sync with the server
        setTicket(prev => ({ ...prev, status: nextStatus }));
        await fetchTicketDetails();
        Alert.alert('Success', res?.message || 'Ticket updated successfully');
      } else {
        Alert.alert('Error', res?.message || 'Unable to update ticket');
      }
    } catch (e) {
      console.log(`Ticket ${type} Error:`, e);
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setStatusAction(null);
    }
  };

  const handleCloseTicket = () =>
    Alert.alert('Close Ticket', 'Are you sure you want to close this ticket?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Close',
        onPress: () => runStatusAction('close', ClientService.closeTicket, 'CLOSED'),
      },
    ]);

  const handleReopenTicket = () =>
    Alert.alert(
      'Reopen Ticket',
      'Are you sure you want to reopen this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Reopen',
          onPress: () => runStatusAction('reopen', ClientService.reopenTicket, 'REOPENED'),
        },
      ],
    );

  useFocusEffect(
    useCallback(() => {
      fetchTicketDetails();
    }, [fetchTicketDetails]),
  );

  const openViewer = (files, index) => {
    const imgs = (files || [])
      .filter(isImage)
      .map(f => ({ uri: buildFileUrl(f.filePath) }));
    if (!imgs.length) return;

    // index is relative to the original files array; map it to image-only array
    const target = files[index];
    const imgIndex = Math.max(
      0,
      files.filter(isImage).findIndex(f => f.id === target?.id),
    );

    setViewerImages(imgs);
    setActiveIndex(imgIndex);
    setShowViewer(true);
  };

  // Ticket level attachments (if API/list provides) else all comment attachments
  const ticketAttachments = Array.isArray(ticket?.attachments)
    ? ticket.attachments
    : comments.flatMap(c => c.attachments || []);

  const isHigh = String(ticket?.priority || '').toUpperCase() === 'HIGH';
  const status = ticket?.status || '-';
  const isResolved = String(status).toLowerCase() === 'resolved';
  // "REOPENED", "Re-Opened", "re opened" ... all become "REOPENED"
  const statusKey = String(status)
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
  const isClosed = statusKey === 'CLOSED';
  const isReopened = statusKey === 'REOPENED';
  // Mark as Closed: hidden for REOPENED, IN_PROGRESS and CLOSED
  const showCloseBtn = !HIDE_CLOSE_BTN_STATUSES.includes(statusKey);
  // Reopen is available only when the ticket is CLOSED
  const showReopenBtn = isClosed;
  const canSend = commentText.trim().length > 0 || attachedFiles.length > 0;

  const renderAttachmentThumb = (file, index, files) => {
    const uri = buildFileUrl(file.filePath);
    if (isImage(file)) {
      return (
        <TouchableOpacity
          key={file.id ?? index}
          onPress={() => openViewer(files, index)}
        >
          <Image source={{ uri }} style={styles.attachmentImg} />
        </TouchableOpacity>
      );
    }
    return (
      <View key={file.id ?? index} style={styles.fileBox}>
        <Icon name="document-text-outline" size={22} color="#676767" />
        <Text style={styles.fileName} numberOfLines={1}>
          {file.fileName}
        </Text>
      </View>
    );
  };

  // History API only has "performed_by" (id). Take name + photo from comments
  // made by the same user id.
  const userMap = {};
  comments.forEach(c => {
    if (c.commented_by === null || c.commented_by === undefined) return;
    const key = String(c.commented_by);
    const cur = userMap[key] || {};
    userMap[key] = {
      name: cur.name || c.commented_by_name,
      photo: cur.photo || c.commented_by_photo,
    };
  });

  const renderHistory = (h, i) => {
    // logged-in client created the ticket, so same id => "You"
    const isYou = String(h.performed_by) === String(ticket?.created_by);
    const u = userMap[String(h.performed_by)] || {};
    const name = h.performed_by_name || u.name;
    const photo = h.performed_by_photo || u.photo;
    const who = isYou ? 'You' : name || `User #${h.performed_by}`;
    return (
      <View style={styles.historyItem} key={String(h.id ?? i)}>
        <View style={styles.HistLeft}>
          <View style={styles.leftImg}>
            <Image
              source={
                photo
                  ? { uri: buildFileUrl(photo) }
                  : require('../../../assets/profile-img.png')
              }
              style={styles.histIcon}
            />
          </View>
          <Text style={styles.histName}>{who}</Text>
        </View>
        <View style={styles.HistRight}>
          <Text style={styles.HistAction}>{prettyStatus(h.action)}</Text>
          {!!h.old_status && !!h.new_status && (
            <Text style={styles.HistStatus}>
              {prettyStatus(h.old_status)} → {prettyStatus(h.new_status)}
            </Text>
          )}
          <Text style={styles.HistTime}>{formatDate(h.created_at)}</Text>
        </View>
      </View>
    );
  };

  const renderComment = (c, i) => {
    const name = c.commented_by_name || `User #${c.commented_by}`;
    return (
      <View style={styles.msgRow} key={String(c.id ?? i)}>
        <View style={styles.msgRowInn}>
          <View style={styles.msgRowImg}>
            <Image
              source={
                c.commented_by_photo
                  ? { uri: buildFileUrl(c.commented_by_photo) }
                  : require('../../../assets/userimg2.png')
              }
              style={styles.msgRowIcon}
            />
          </View>
          <View style={styles.msgRowText}>
            <Text style={styles.msgRowTitle}>{name}</Text>
            <Text style={styles.msgRowMin}>{formatDate(c.created_at)}</Text>
          </View>
        </View>

        {!!c.comment && <Text style={styles.msgText}>{c.comment}</Text>}

        {Array.isArray(c.attachments) && c.attachments.length > 0 && (
          <View style={styles.attachmentRow}>
            {c.attachments.map((f, idx) =>
              renderAttachmentThumb(f, idx, c.attachments),
            )}
          </View>
        )}
      </View>
    );
  };

  // Selected (not yet sent) files shown above the input
  const renderSelectedFiles = () => {
    if (!attachedFiles.length) return null;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selectedFilesBar}
        contentContainerStyle={{ gap: 10, paddingTop: 8 }}
      >
        {attachedFiles.map((f, index) => (
          <View key={`${f.uri}-${index}`} style={styles.selectedFile}>
            {String(f.type).startsWith('image/') ? (
              <Image source={{ uri: f.uri }} style={styles.selectedFileImg} />
            ) : (
              <View style={[styles.selectedFileImg, styles.selectedFileDoc]}>
                <Icon name="document-text-outline" size={22} color="#676767" />
                <Text style={styles.selectedFileName} numberOfLines={1}>
                  {f.fileName}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.removeFileBtn}
              onPress={() => removeFile(index)}
            >
              <Icon name="close" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <View style={styles.ticketDetails}>
          <LinearGradient
            colors={['#d0eede', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={GlobalStyles.background}
          >
            <View style={GlobalStyles.flexdv}>
              <TouchableOpacity
                style={GlobalStyles.leftArrow}
                onPress={() => navigation.goBack()}
              >
                <View style={GlobalStyles.arrowBox}>
                  <Image source={require('../../../assets/arrow1.png')} />
                </View>
                <Text style={GlobalStyles.titleText}>
                  {ticket?.ticket_no || ticketNo || 'Ticket'}
                </Text>
              </TouchableOpacity>

              <View style={GlobalStyles.rightSection}>
                <TouchableOpacity style={{ position: 'relative' }}>
                  <Image source={require('../../../assets/notification.png')} />
                  <View style={GlobalStyles.notiDot}></View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                >
                  <Image source={require('../../../assets/menu-bar.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.ticketDetailsInn}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Image
                style={styles.dashBoxIcon}
                source={require('../../../assets/ticket2.png')}
              />
              <View style={styles.titleBlock}>
                <Text style={styles.title}>
                  {ticket?.subject_name || 'Ticket'}
                </Text>
                {isHigh && (
                  <Image
                    style={styles.dashBoxUrgIcon}
                    source={require('../../../assets/urgent.png')}
                  />
                )}
              </View>
            </View>

            {/* Description */}
            <View style={styles.descSection}>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.description}>
                {ticket?.description || '-'}
              </Text>
            </View>

            {/* Metadata */}
            <View style={styles.metaRow}>
              <View>
                <Text style={styles.metaLabel}>Created by</Text>
                <Text style={styles.metaValue}>
                  {ticket?.created_by_name || ticket?.created_by || '-'}
                </Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Created on</Text>
                <Text style={styles.metaValue}>
                  {formatDate(ticket?.created_at)}
                </Text>
              </View>
            </View>

            {/* Assignee */}
            <View style={styles.assigneSection}>
              <Text style={styles.sectionLabel}>Assignee Details</Text>
              <View style={styles.assigneeRow}>
                <View style={styles.assignRowLeft}>
                  <Image
                    source={require('../../../assets/screen1.jpg')}
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1, paddingLeft: 8 }}>
                    <Text style={styles.assigneLabel}>Assignee</Text>
                    <Text style={styles.assigneeName}>
                      {ticket?.assignee_name ||
                        ticket?.assigned_to_name ||
                        'Unassigned'}
                    </Text>
                  </View>
                </View>
                <View style={styles.resolvedBadge}>
                  <Text
                    style={[
                      styles.resolvedText,
                      !isResolved && styles.statusOther,
                    ]}
                  >
                    {status}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}
                  >
                    <Icon name="time-outline" size={18} color="#999" />
                    <Text style={styles.timeAgo}>
                      {' '}
                      {formatDate(ticket?.updated_at)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Patient Details (shown only if available) */}
            {(ticket?.patient_name || ticket?.patient_id) && (
              <View style={styles.patientDetail}>
                <Text style={styles.sectionLabel}>Patient Details</Text>
                <View style={styles.patientDetailInn}>
                  <Image
                    source={require('../../../assets/menu12.png')}
                    style={styles.patientIcon}
                  />
                  <View style={styles.patientDetailText}>
                    <Text style={styles.patientName}>
                      {ticket?.patient_name}{' '}
                      {!!ticket?.patient_age && (
                        <Text style={styles.patientNameSub}>
                          ({ticket.patient_age}y
                          {ticket?.patient_gender
                            ? `, ${ticket.patient_gender}`
                            : ''}
                          )
                        </Text>
                      )}
                    </Text>
                    <Text style={styles.patientId}>{ticket?.patient_id}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Attachments */}
            {ticketAttachments.length > 0 && (
              <View style={styles.attachmentSection}>
                <Text style={styles.sectionLabel}>Attachments</Text>
                <View style={styles.attachmentRow}>
                  {ticketAttachments.map((f, idx) =>
                    renderAttachmentThumb(f, idx, ticketAttachments),
                  )}
                </View>
              </View>
            )}

            {/* History Block */}
            <View style={styles.histSection}>
              <TouchableOpacity
                style={styles.histSectionTitle}
                onPress={() => setShowHistory(v => !v)}
              >
                <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>
                  History
                </Text>
                <Icon
                  name={showHistory ? 'caret-down' : 'caret-forward'}
                  size={13}
                  color="#333"
                />
              </TouchableOpacity>

              {showHistory &&
                (history.length === 0 ? (
                  <Text style={styles.emptyText}>No history found</Text>
                ) : (
                  <ScrollView
                    style={styles.historyBox}
                    nestedScrollEnabled
                    contentContainerStyle={{ paddingRight: 10 }}
                  >
                    {history.map(renderHistory)}
                  </ScrollView>
                ))}
            </View>

            {/* Comments Block - whole section opens the comments modal */}
            <TouchableOpacity
              style={styles.commentsSection}
              activeOpacity={0.8}
              onPress={() => setCommentsModal(true)}
            >
              <View style={styles.commentsSectionTitle}>
                <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>
                  Comments
                </Text>
                <View style={styles.cmntsFlex}>
                  <Icon name="ellipsis-horizontal" size={20} color="#000" />
                  <Text style={styles.cmntsCount}>{comments.length}</Text>
                </View>
              </View>

              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#00A635"
                  style={{ marginVertical: 10 }}
                />
              )}

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              {/* Read-only preview: shows live what is typed in the modal */}
              <View style={styles.commentsMid} pointerEvents="none">
                <TextInput
                  multiline
                  numberOfLines={4}
                  editable={false}
                  placeholder="Your Comments"
                  value={commentText}
                  style={GlobalStyles.textAreaNew}
                />
                <View style={styles.attachIcon}>
                  <Icon name="attach" size={25} color="#00A635" />
                </View>
              </View>

              {attachedFiles.length > 0 && (
                <Text style={styles.attachedCountText}>
                  {attachedFiles.length} file(s) attached
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Viewer Modal */}
        <Modal
          visible={showViewer}
          transparent
          onRequestClose={() => setShowViewer(false)}
        >
          <View style={styles.modalBg}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowViewer(false)}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <FlatList
              data={viewerImages}
              horizontal
              pagingEnabled
              keyExtractor={(_, i) => i.toString()}
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={activeIndex}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              renderItem={({ item }) => (
                <View style={styles.fullImageWrapper}>
                  <Image
                    source={item}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            />
          </View>
        </Modal>

        {/* Comments Modal */}
        <Modal
          transparent
          visible={commentsModal}
          animationType="slide"
          onRequestClose={() => {
            if (showSourceSheet) setShowSourceSheet(false);
            else setCommentsModal(false);
          }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={GlobalStyles.modalOverlay}>
              <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity
                  style={GlobalStyles.modalClose}
                  onPress={() => setCommentsModal(false)}
                >
                  <Text style={GlobalStyles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={[GlobalStyles.mdlTitle2, { marginBottom: 20 }]}>
                  Comments
                </Text>

                <ScrollView
                  ref={commentsScrollRef}
                  showsVerticalScrollIndicator={false}
                  onContentSizeChange={() =>
                    commentsScrollRef.current?.scrollToEnd({ animated: true })
                  }
                >
                  {comments.length === 0 ? (
                    <Text style={styles.emptyText}>No comments yet</Text>
                  ) : (
                    comments.map(renderComment)
                  )}
                </ScrollView>

                {renderSelectedFiles()}

                <View style={styles.inputBar}>
                  <TextInput
                    placeholder="Type Here"
                    multiline
                    value={commentText}
                    onChangeText={setCommentText}
                    style={styles.input}
                  />

                  <TouchableOpacity
                    style={styles.attachBtn}
                    onPress={() => setShowSourceSheet(true)}
                  >
                    <Icon name="attach" size={25} color="#00A635" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.sendBtn,
                      (sending || !canSend) && { opacity: 0.6 },
                    ]}
                    onPress={handleSendComment}
                    disabled={sending || !canSend}
                  >
                    {sending ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Image
                        source={require('../../../assets/send-btn.png')}
                        style={{ width: 18, height: 18, resizeMode: 'contain' }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Attachment source chooser: Camera / Gallery / Document */}
            {showSourceSheet && (
              <TouchableOpacity
                style={styles.sheetOverlay}
                activeOpacity={1}
                onPress={() => setShowSourceSheet(false)}
              >
                <View style={styles.sheet}>
                  <Text style={styles.sheetTitle}>Add Attachment</Text>

                  <TouchableOpacity
                    style={styles.sheetOption}
                    onPress={handleCamera}
                  >
                    <Icon name="camera-outline" size={22} color="#00A635" />
                    <Text style={styles.sheetOptionText}>Camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sheetOption}
                    onPress={handleGallery}
                  >
                    <Icon name="images-outline" size={22} color="#00A635" />
                    <Text style={styles.sheetOptionText}>Gallery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sheetOption}
                    onPress={handleDocument}
                  >
                    <Icon name="document-outline" size={22} color="#00A635" />
                    <Text style={styles.sheetOptionText}>Document</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sheetCancel}
                    onPress={() => setShowSourceSheet(false)}
                  >
                    <Text style={styles.sheetCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>

      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 16,
          paddingBottom: 25,
        }}
      >
        {/* Reopen: visible only after the ticket is closed */}
        {showReopenBtn && (
          <TouchableOpacity
            style={[GlobalStyles.reOpenBtn, !!statusAction && { opacity: 0.6 }]}
            onPress={handleReopenTicket}
            disabled={!!statusAction}
          >
            {statusAction === 'reopen' ? (
              <ActivityIndicator size="small" color="#00A635" />
            ) : (
              <Text style={GlobalStyles.reOpenBtnText}>Reopen</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Mark as Closed: hidden once the ticket is closed */}
        {showCloseBtn && (
          <TouchableOpacity
            style={[
              GlobalStyles.applyBtnFullWidth,
              !!statusAction && { opacity: 0.6 },
            ]}
            onPress={handleCloseTicket}
            disabled={!!statusAction}
          >
            {statusAction === 'close' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={GlobalStyles.applyBtnTextNew}>Mark as Closed</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

export default TicketDetails;

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  closeBtn: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  fullImageWrapper: {
    width,
    height: height - 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: { width: '100%', height: '100%' },

  attachmentSection: { marginBottom: 17 },
  attachmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  attachmentImg: {
    width: 65,
    height: 65,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#F2F2F2',
  },
  fileBox: {
    width: 90,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  fileName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#676767',
    marginTop: 2,
  },

  ticketDetailsInn: { paddingHorizontal: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dashBoxIcon: { width: 24, height: 24, resizeMode: 'contain' },
  titleBlock: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 19,
    color: '#000',
    flexShrink: 1,
  },
  dashBoxUrgIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  descSection: { marginBottom: 20 },
  sectionLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
    marginBottom: 5,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#9F9F9F',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#797979',
    marginBottom: 17,
    paddingBottom: 17,
  },
  metaLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
    marginBottom: 5,
  },
  metaValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#A9AAA9',
  },
  assigneSection: { marginBottom: 17 },
  assigneeRow: { flexDirection: 'row' },
  assignRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  assigneLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
    marginBottom: 2,
  },
  assigneeName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#8F8F8F',
  },
  resolvedBadge: { alignItems: 'flex-end' },
  resolvedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#1BAF83',
    backgroundColor: '#E5FFF7',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  statusOther: { color: '#148F3B', backgroundColor: 'rgba(230,255,247,1)' },
  timeAgo: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#8E8E8E',
  },
  patientDetail: { marginBottom: 17 },
  patientDetailInn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEFFF3',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00A635',
    padding: 12,
  },
  patientIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#676767',
  },
  patientDetailText: { flex: 1, paddingLeft: 15 },
  patientName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
    paddingBottom: 7,
  },
  patientNameSub: { color: '#9F9F9F' },
  patientId: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 16,
    color: '#9F9F9F',
  },

  // History
  histSection: { paddingVertical: 12 },
  historyBox: { maxHeight: 150 },
  histSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#797979',
    paddingBottom: 8,
    marginBottom: 8,
  },
  HistLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  HistRight: { alignItems: 'flex-end' },
  leftImg: { width: 34, height: 34, borderRadius: 17, overflow: 'hidden' },
  histIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 17,
  },
  histName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
  },
  HistAction: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
    textAlign: 'right',
  },
  HistStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    lineHeight: 13,
    color: '#148F3B',
    marginTop: 2,
  },
  HistTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    lineHeight: 14,
    color: '#A6A6A6',
    marginTop: 3,
  },

  // Comments (main section)
  commentsSection: { marginBottom: 10 },
  commentsSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cmntsFlex: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cmntsCount: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#8E8E8E',
  },
  commentsMid: { position: 'relative', marginBottom: 10 },
  attachIcon: { position: 'absolute', right: 15, bottom: 15 },
  attachedCountText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#00A635',
    marginBottom: 6,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#E53935',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontFamily: 'Poppins-Regular',
    marginVertical: 20,
  },

  // Comments modal
  msgRow: { marginBottom: 15 },
  msgRowInn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  msgRowImg: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  msgRowIcon: { width: 40, height: 40, resizeMode: 'cover' },
  msgRowTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#272727',
  },
  msgRowMin: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#B4BBC6',
    marginTop: 2,
  },
  msgText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#272727',
    backgroundColor: '#EFF2FC',
    borderRadius: 10,
    padding: 8,
  },
  inputBar: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 50,
    marginTop: 5,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    height: 50,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 88,
    color: '#000',
  },
  attachBtn: {
    position: 'absolute',
    right: 48,
    top: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    position: 'absolute',
    right: 7,
    top: 8,
    width: 34,
    height: 34,
    backgroundColor: '#00A635',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Selected files (before sending)
  selectedFilesBar: { flexGrow: 0, marginTop: 5 },
  selectedFile: { position: 'relative' },
  selectedFileImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    resizeMode: 'cover',
  },
  selectedFileDoc: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  selectedFileName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 8,
    color: '#676767',
  },
  removeFileBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Attachment source sheet
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  sheetTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sheetOptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#272727',
  },
  sheetCancel: { alignItems: 'center', paddingTop: 16 },
  sheetCancelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#E53935',
  },
});