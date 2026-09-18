package org.youxx.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.youxx.common.result.Result;
import org.youxx.common.userInfoMaintainer.BaseContext;
import org.youxx.dto.ChatRequest;
import org.youxx.service.LlmService;
import org.youxx.vo.AgentChatResultVO;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/llm")
@RequiredArgsConstructor
@Tag(name = "AI 助手", description = "基于大模型的购物助手，支持自然语言加购")
public class LlmController {

    private final LlmService llmService;

    /**
     * Agent 对话接口（非流式，带下单 tool）
     */
    @Operation(summary = "AI 助手对话",
            description = "非流式接口，需登录。同一轮对话请复用同一个 sessionId 以保留上下文；"
                    + "若模型识别出加购意图，cartItems 会返回商品与数量，前端应据此更新购物车而不是解析 content 文本")
    @PostMapping("/agent/chat")
    public Result<AgentChatResultVO> agentChat(@RequestBody ChatRequest request) {
        // 请求体不再携带 userId；身份信息由 JWT 拦截器写入 BaseContext，供下单工具使用
        if (BaseContext.getCurrentId() == null) {
            return Result.error("请先登录后再使用AI助手");
        }

        String userMessage = request.getMessage();
        // sessionId 由前端生成随请求传入；缺失时兜底生成，保证同一对话复用持久化 memory
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = UUID.randomUUID().toString();
        }

        try {
            AgentChatResultVO result = llmService.chatWithTools(userMessage, sessionId);
            return Result.success(result);
        } catch (Exception e) {
            log.error("Agent对话失败", e);
            return Result.error("AI助手暂时不可用，请稍后再试");
        }
    }
}
