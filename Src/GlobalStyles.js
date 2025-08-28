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
  mdlTitle:{
    fontFamily:'Poppins-SemiBold',
    fontSize:22,
    lineHeight:24,
    color:'#535353',
    marginBottom:2,
  },
  mdlSubTitle:{
    fontFamily:'Poppins-Reqular',
    fontSize:12,
    lineHeight:14,
    color:'#A4A4A4',
    marginBottom:20,
  },
  inpBox:{
    marginBottom:10,
  },
  label:{
    fontFamily:'Poppins-Reqular',
    fontSize:12,
    lineHeight:14,
    color:'#4A4A4A',
    marginBottom:10,
  },
  inputContainer:{
    position:'relative',
  },
  input:{
    height:50,
    borderWidth:1,
    borderColor:'#C5C5C5',
    borderRadius:10,
    paddingLeft:40,
    paddingRight:10,
  },













  // Common Modal End








});
