// 此文件 -- 疯转三个方法 专门操作token

const key = 'token'
//                         token 别得页面传过来得
export const setToken = (token)=>{
                        // key value
    localStorage.setItem(key,token)
    // localStorage.setToken('token',token)
}
// 获取
export const getToken = () =>localStorage.getItem(key)

// 删除
export const removeToken = ()=>localStorage.removeItem(key)