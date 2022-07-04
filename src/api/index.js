import axios from '@/utils/request.js'

export const loginAPI = data =>axios({
    url:'/login',
    method:'POST',
    data
})

// 左侧得菜单
export const menusLeftAPI =()=>axios({
    url:'/menus',
    method:'GET',
    
})
// 用户列表
export const userListAPI=(params)=>axios({
    url:'/users',
    method:'GET',
    params
})

// 修改用户状态
export const userStateUserAPI =({url,params})=>axios({
    url,
    method:'put',
    params
})

// 添加用户
export const addUserAPI = data =>axios({
    url:'/users',
    method:'post',
    data
})

// 根据id查询用户信息
export const referUserAPI = ({url,params}) =>axios({
    url,
    method:'get',
    params
})
// 修改
export const bianjiUserAPI = ({url,data}) =>axios({
    url,
    method:'put',
    data
})

// 删除用户
export const removeUserAPI = ({url})=>axios({
    url,
    method:'delete'
})

// 所有的权限列表
export const powerListAPI = ({url})=>axios({
    url,
    method:'get'
})

//角色列表
export const roleListAPI = ()=>axios({
    url:'/roles',
    method:'get'
})

// 添加角色
export const addRoleAPI = data =>axios({
    url:'/roles',
    method:'post',
    data
})

// 根据id查询角色
export const referRolesAPI = ({url}) =>axios({
    url,
    method:'get'
})

// 提交角色
export const tijiaoRolesAPI = ({url,data}) =>axios({
    url,
    method:'put',
    data
})

// 删除角色
export const removeRoleAPI = ({url})=>axios({
    url,
    method:'delete'
})

// 删除角色指定权限
export const removeRoleQuanAPI = ({url}) =>axios({
    url,
    method:'delete'
})

// 角色授权
export const shouquanRoleAPI = ({url,data})=>axios({
    url,
    method:'post',
    data
})

// 分配角色用户
export const fenpeiRoleAPI = ({url,data})=>axios({
    url,
    method:'put',
    data
})

// 商品分类数据列表
export const goodsListAPI = params=>axios({
    url:'/categories',
    method:'get',
    params
})

// 获取父级分类的数据列表
export const addFuListAPI = params =>axios({
    url:'/categories',
    method:'get',
    params
})

// 添加分类
export const addCateListAPI = data =>axios({
    url:'/categories',
    method:'post',
    data
})

// 参数列表
export const canshugoriesAPI =( { url,params}) =>axios({
    url,
    method:'get',
    params
})

// 添加动态参数或静态属性
export const tjcsgoriesAPI = ({url,data})=>axios({
    url,
    method:'post',
    data
})

// 根据id查询参数
export const refercsAPI = ({url,params}) => axios({
    url,
    method:'get',
    params
})

// 编辑提交参数
export const edittjAPI = ({url,data}) =>axios({
    url,
    method:'put',
    data
})

// 删除参数
export const removecsAPI =({url,params}) => axios({
    url,
    method:'delete',
    params
})

// 商品列表数据
export const goodListAPI = params => axios({
    url:'/goods',
    method:'get',
    params
})

// 删除商品
export const removegoodsAPI = ({url}) => axios({
    url,
    method:'delete'
})

// 添加商品
export const tianjiagoodsAPI = ({data}) => axios({
    url:'/goods',
    method:'post',
    data
})

// 订单数据列表
export const ordersListAPI = params =>axios({
    url:'/orders',
    method:'get',
    params
})

// 查看物流信息
export const kuaidixxAPI = ({url})=>axios({
    url,
    method:"get"
})

// 基于时间统计的折线图
export const tjtAPI = ({url}) =>axios({
    url,
    method:'get'
})