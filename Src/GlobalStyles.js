import { StyleSheet } from 'react-native';


export const theme = {
  text: '#000000',

};

export const GlobalStyles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 16,
  },


  // Common Modal Start
  modalOverlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
  },
  modalClose: {
    width: 23,
    height: 23,
    backgroundColor: '#000',
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -27,
    alignSelf: 'center',
  },
  closeIcon: {
    fontSize: 11,
    color: '#fff',
  },
  mdlTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    lineHeight: 24,
    color: '#535353',
    marginBottom: 2,
  },
  mdlTitle2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    // lineHeight: 17,
    color: '#000000',
    marginBottom: 2,
  },
  mdlCenterTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    lineHeight: 24,
    color: '#535353',
    textAlign: 'center',
    marginBottom: 2,
  },
  mdlSubTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    color: '#A4A4A4',
    marginBottom: 20,
  },
  inpBox: {
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    color: '#7D7B7B',
    marginBottom: 10,
  },
  regText: {
    color: '#FA2C2C',
  },
  inputContainer: {
    position: 'relative',
  },
  // mdlIcon:{
  //   position:'absolute',
  //   left:10,
  //   top:18,
  // },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#C2C2C2',
  },
  inputv2: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical:12,
    color: '#C2C2C2',
  },
  disabledInput: {
    backgroundColor: '#F6F6F6',
  },
  textArea: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#C2C2C2',
  },
  textAreaNew: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    height: 85,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#C2C2C2',
    textAlignVertical: 'top',
  },
  applyBtn: {
    alignSelf: 'center',
    backgroundColor: '#00A651',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 38,
    marginTop: 10,
  },
  applyBtnFullWidth: {
    backgroundColor: '#00A651',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 38,
    marginTop: 10,
  },
  applyBtnNew: {
    backgroundColor: '#00A651',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 38,
    marginTop: 10,
  },
  applyBtnText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
  },
  applyBtnTextNew: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
    textAlign: 'center',
  },
  tempSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  switchLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#000',
  },
  maxTextLength: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    lineHeight: 13,
    color: '#6D6D6D',
    paddingTop: 8,
  },

  // Common Modal End


  // Common Header Start
  background: {
    flex: 1,
    width: '100%',
    paddingTop: 58,
    paddingBottom: 20,
  },
  flexdv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  arrowBox: {
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#AFAFAF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 18,
    color: '#000',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  notiDot: {
    width: 8,
    height: 8,
    backgroundColor: '#F82525',
    borderRadius: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  // Common Header End

  // Common Search Bar Start
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    gap: 9,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 11,
    zIndex: 1,
    color: '#DEDEDE',
  },
  searchinput: {
    flex: 1,
    height: 45,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingLeft: 42,
    paddingRight: 10,
  },
  filterButton: {
    backgroundColor: '#00A651',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newEstimate: {
    backgroundColor: '#4B5550',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Common Search Bar End





});
