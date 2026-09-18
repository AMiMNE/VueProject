package org.youxx.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.youxx.common.result.Result;
import org.youxx.common.userInfoMaintainer.BaseContext;
import org.youxx.dto.LoginRequest;
import org.youxx.dto.RegisterRequest;
import org.youxx.service.AuthService;
import org.youxx.vo.LoginVO;
import org.youxx.vo.UserVO;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "认证", description = "登录 / 注册 / 登出 / 当前用户信息")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "登录", description = "校验用户名密码，成功后返回 JWT。前端需保存 token 并放入后续请求的 token 请求头。")
    @SecurityRequirements
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody LoginRequest request) {
        LoginVO result = authService.login(request.getUsername(), request.getPassword());
        return Result.success(result);
    }

    @Operation(summary = "登出", description = "将当前 token 加入黑名单，使其立即失效。")
    @PostMapping("/logout")
    public Result<Void> logout(
            @Parameter(description = "当前登录令牌，与请求头中的 token 相同，不传则不做任何处理", example = "eyJhbGciOiJIUzI1NiJ9...")
            @RequestHeader(value = "token", required = false) String token) {
        authService.logout(token);
        return Result.success();
    }

    @Operation(summary = "注册", description = "创建普通用户（role 固定为 USER，status 为 NORMAL），用户名需唯一。")
    @SecurityRequirements
    @PostMapping("/register")
    public Result<UserVO> register(@RequestBody RegisterRequest request) {
        UserVO user = authService.register(request.getUsername(), request.getPassword(), request.getPhone());
        return Result.success(user);
    }

    @Operation(summary = "获取当前登录用户信息", description = "身份取自 token，无需传参。")
    @GetMapping("/info")
    public Result<UserVO> info() {
        String userId = BaseContext.getCurrentId();
        UserVO user = authService.getInfo(userId);
        return Result.success(user);
    }
}
