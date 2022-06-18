const config = {
    mongo: {
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            wtimeoutMS: 30000,
            keepAlive: true,
            maxPoolSize: 50,
            autoIndex: false,
            retryWrites: false
        },
        url: 'mongodb+srv://superuser:Admin%40123@cluster0.76gm5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    },
    server: {
        host: 'localhost',
        port: 1337
    }
};

export default config;
