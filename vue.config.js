const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy:{
        '/api':{
            target:'http://127.0.0.1:8888/api/private/v1',
            // target:'http://175.27.228.178:3434/api/private/v1',
            pathRewrite:{
                '^/api':''
            }
        },
        // 可以有多个
        // '/josadj':{

        // }
    }
}
})
