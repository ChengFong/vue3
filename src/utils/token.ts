// 封裝本地存儲數據與讀取數據方法
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
// 本地存儲獲取數據
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}
// 本地存儲刪除數據方法
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}
