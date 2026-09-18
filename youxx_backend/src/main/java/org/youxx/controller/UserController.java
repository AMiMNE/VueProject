package org.youxx.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.youxx.common.result.PageResult;
import org.youxx.common.result.Result;
import org.youxx.common.userInfoMaintainer.BaseContext;
import org.youxx.dto.UpdatePasswordRequest;
import org.youxx.dto.UpdateStatusRequest;
import org.youxx.dto.UserAddressRequest;
import org.youxx.dto.UserUpdateRequest;
import org.youxx.entity.User;
import org.youxx.entity.UserAddress;
import org.youxx.service.UserService;
import org.youxx.vo.UploadVO;
import org.youxx.vo.UserVO;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "用户", description = "个人资料、收货地址、以及管理员侧的用户管理")
public class UserController {

    private final UserService userService;

    // ==================== 个人信息（当前登录用户） ====================
    // 注意：这些路径必须在 /{id} 之前，避免被路径变量误匹配

    @Operation(summary = "获取个人资料")
    @GetMapping("/profile")
    public Result<UserVO> profile() {
        User user = userService.getProfile(BaseContext.getCurrentId());
        return Result.success(toVO(user));
    }

    @Operation(summary = "修改个人资料", description = "普通用户仅可修改手机号、邮箱、头像；密码走 /password 接口")
    @PutMapping("/profile")
    public Result<UserVO> updateProfile(@RequestBody UserUpdateRequest request) {
        // 普通用户仅可改 phone/email/avatar；密码、角色、状态等不由此接口处理
        User user = new User();
        BeanUtils.copyProperties(request, user);
        User updated = userService.updateProfile(BaseContext.getCurrentId(), user);
        return Result.success(toVO(updated));
    }

    @Operation(summary = "修改密码", description = "需提供原密码校验；修改成功后原 token 仍有效，如需强制下线请调用登出接口")
    @PutMapping("/password")
    public Result<Void> updatePassword(@RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(BaseContext.getCurrentId(), request.getOldPassword(), request.getNewPassword());
        return Result.success();
    }

    @Operation(summary = "上传头像",
            description = "multipart/form-data 上传；后端会自动压缩并落盘，同时把新路径写回当前用户的 avatar 字段，"
                    + "前端拿到返回的 url 即可直接展示")
    @PostMapping("/avatar/upload")
    public Result<UploadVO> uploadAvatar(
            @Parameter(description = "图片文件，单文件最大 10MB", required = true)
            @RequestParam("file") MultipartFile file) {
        // 头像落盘 + 路径写回当前用户 avatar，一次完成；前端拿到 url 即可直接展示
        String url = userService.uploadAvatar(file);
        User u = new User();
        u.setAvatar(url);
        userService.updateProfile(BaseContext.getCurrentId(), u);
        UploadVO vo = new UploadVO();
        vo.setUrl(url);
        return Result.success(vo);
    }

    // ==================== 地址管理 ====================

    @Operation(summary = "查询收货地址列表")
    @GetMapping("/address")
    public Result<List<UserAddress>> listAddresses() {
        List<UserAddress> addresses = userService.listAddresses(BaseContext.getCurrentId());
        return Result.success(addresses);
    }

    @Operation(summary = "新增收货地址", description = "user_id 由后端从 token 解析，前端无需传递")
    @PostMapping("/address")
    public Result<UserAddress> addAddress(@RequestBody UserAddressRequest request) {
        UserAddress address = new UserAddress();
        BeanUtils.copyProperties(request, address);
        address.setUserId(BaseContext.getCurrentId());
        UserAddress created = userService.addAddress(address);
        return Result.success(created);
    }

    @Operation(summary = "修改收货地址")
    @PutMapping("/address/{id}")
    public Result<UserAddress> updateAddress(
            @Parameter(description = "地址 ID", example = "1", required = true) @PathVariable Long id,
            @RequestBody UserAddressRequest request) {
        UserAddress address = new UserAddress();
        BeanUtils.copyProperties(request, address);
        UserAddress updated = userService.updateAddress(id, address);
        return Result.success(updated);
    }

    @Operation(summary = "删除收货地址")
    @DeleteMapping("/address/{id}")
    public Result<Void> deleteAddress(
            @Parameter(description = "地址 ID", example = "1", required = true) @PathVariable Long id) {
        userService.deleteAddress(id);
        return Result.success();
    }

    @Operation(summary = "设为默认收货地址")
    @PutMapping("/address/{id}/default")
    public Result<Void> setDefaultAddress(
            @Parameter(description = "地址 ID", example = "1", required = true) @PathVariable Long id) {
        userService.setDefaultAddress(id);
        return Result.success();
    }

    // ==================== 用户管理（管理员） ====================

    @Operation(summary = "【管理员】分页查询用户列表", description = "支持按用户名关键字与角色过滤")
    @GetMapping("/list")
    public Result<PageResult<UserVO>> list(
            @Parameter(description = "关键字，匹配用户名", example = "zhang") @RequestParam(required = false) String keyword,
            @Parameter(description = "角色过滤: ADMIN / USER", example = "USER") @RequestParam(required = false) String role,
            @Parameter(description = "页码，从 1 开始", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") int size) {
        PageResult<User> result = userService.listUsers(keyword, role, page, size);
        List<UserVO> voList = result.getRecords().stream().map(this::toVO).toList();
        return Result.success(PageResult.of(voList, result.getTotal(), page, size));
    }

    @Operation(summary = "【管理员】查询用户详情")
    @GetMapping("/{id}")
    public Result<UserVO> detail(
            @Parameter(description = "用户 ID", example = "A001", required = true) @PathVariable String id) {
        User user = userService.getUser(id);
        return Result.success(toVO(user));
    }

    @Operation(summary = "【管理员】新增用户", description = "请求体为 User 实体，需传 username / password / role / status")
    @PostMapping
    public Result<UserVO> add(@RequestBody User user) {
        // 管理员新增用户：需设置密码、角色、状态等，保留 entity 入参
        User created = userService.addUser(user);
        return Result.success(toVO(created));
    }

    @Operation(summary = "【管理员】编辑用户")
    @PutMapping("/{id}")
    public Result<UserVO> update(
            @Parameter(description = "用户 ID", example = "U001", required = true) @PathVariable String id,
            @RequestBody User user) {
        // 管理员编辑用户：同上，保留 entity 入参
        User updated = userService.updateUser(id, user);
        return Result.success(toVO(updated));
    }

    @Operation(summary = "【管理员】修改用户状态", description = "用于启用/禁用账号，DISABLED 后该用户无法登录")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(
            @Parameter(description = "用户 ID", example = "U001", required = true) @PathVariable String id,
            @RequestBody UpdateStatusRequest request) {
        userService.updateStatus(id, request.getStatus());
        return Result.success();
    }

    @Operation(summary = "【管理员】删除用户")
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @Parameter(description = "用户 ID", example = "U001", required = true) @PathVariable String id) {
        userService.deleteUser(id);
        return Result.success();
    }

    /** User -> UserVO，屏蔽 password */
    private UserVO toVO(User user) {
        if (user == null) {
            return null;
        }
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        return vo;
    }
}
