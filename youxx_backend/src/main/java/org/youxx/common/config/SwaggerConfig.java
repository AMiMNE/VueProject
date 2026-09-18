package org.youxx.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI 3 接口文档配置。
 * <p>
 * UI 地址: http://localhost:8081/swagger-ui.html
 * JSON 规范: http://localhost:8081/v3/api-docs
 */
@Configuration
public class SwaggerConfig {

    /** 与 youxx.jwt.token-name 及 JwtTokenUserInterceptor 读取的请求头保持一致 */
    private static final String TOKEN_HEADER = "token";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("YOUXX 商城 API 文档")
                        .description("""
                                面向 youxx_user / youxx_admin 前端的接口说明。

                                认证方式：除登录、注册及商品公开查询接口外，
                                其余 /api/** 接口均需在请求头 token 中携带登录返回的 JWT。
                                点击右上角 Authorize 填入 token 后，即可在线调试所有接口。
                                """)
                        .version("1.0.0")
                        .contact(new Contact().name("YOUXX 后端")))
                // 全局声明 token 请求头，Swagger UI 的 Authorize 会据此自动附加到请求
                .components(new Components().addSecuritySchemes(TOKEN_HEADER,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name(TOKEN_HEADER)
                                .description("登录接口返回的 token，直接填值，无需 Bearer 前缀")))
                .addSecurityItem(new SecurityRequirement().addList(TOKEN_HEADER));
    }
}
