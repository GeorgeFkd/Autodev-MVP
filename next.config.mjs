/** @type {import('next').NextConfig} */
const nextConfig = {
    // probably should reroute this through my own api
    //also do CORS properly only allow certain domains not *
    async headers() {
        return [
            {
                "source": "/api/openapi-gen",
                "headers": [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-Requested-With, Content-Type",
                    },
                ],
            },
            {
                "source": "/api/openapi-langs",
                "headers": [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-Requested-With, Content-Type",
                    },
                ],
            },
            {
                "source": "/api/init-git-repo",
                "headers": [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-Requested-With, Content-Type",
                    },
                ],
            },
            {
                "source": "/api/frontend-code-gen",
                "headers": [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-Requested-With, Content-Type",
                    },
                ],
            },
        ]
    }
    // i should enable cors here from
    // http://api.openapi-generator.tech/api/gen/clients

};

export default nextConfig;
