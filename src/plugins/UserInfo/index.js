const USER = 'user';


const UserInfo = {
  getUserInfo() {
    return JSON.parse(localStorage.getItem(USER) || '')
  },
  setUserInfo (info) {
    let encoded = JSON.stringify(info);
    localStorage.setItem(USER, encoded)
  }
}


export default UserInfo