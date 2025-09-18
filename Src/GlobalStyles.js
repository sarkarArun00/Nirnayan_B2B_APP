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
    paddingTop: 45,
    paddingBottom: 60,
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
  mdlSubTitle: {
    fontFamily: 'Poppins-Reqular',
    fontSize: 12,
    lineHeight: 14,
    color: '#A4A4A4',
    marginBottom: 20,
  },
  inpBox: {
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Poppins-Reqular',
    fontSize: 12,
    lineHeight: 14,
    color: '#7D7B7B',
    marginBottom: 10,
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
    fontFamily: 'Poppins-Reqular',
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
  textArea: {
    fontFamily: 'Poppins-Reqular',
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
  applyBtn: {
    alignSelf: 'center',
    backgroundColor: '#00A651',
    borderRadius: 6,
    paddingVertical: 13,
    paddingHorizontal: 38,
    marginTop: 10,
  },
  applyBtnNew: {
    backgroundColor: '#00A651',
    borderRadius: 6,
    paddingVertical: 13,
    paddingHorizontal: 38,
    marginTop: 10,
  },
  applyBtnText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 15,
    color: '#fff',
  },
  applyBtnTextNew: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 15,
    color: '#fff',
    textAlign:'center',
  },
  tempSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:5,
    marginBottom:10,
  },
  switchLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#000',
  },












  // Common Modal End








});
