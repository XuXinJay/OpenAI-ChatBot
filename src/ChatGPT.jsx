import React, { useState } from "react";
import "./chatgpt.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

/* 填入KEY */
const API_KEY = "Your_Key";

/* content設定人設 */
const systemMessage = {
  role: "system",
  content:
    "Explain things like you're a professional personal assistant,and reply in Traditional Chinese",
};

function ChatGpt() {
  const [messages, setMessages] = useState([
    {
      message: "你好，我是你的智能助手，請問需要什麼幫助嗎?",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    /* 可以從這邊訓練資料message.includes("")，message:回覆 */
    // if (message.includes("")) {
    //   const responseMessage = {
    //     message:"",
    //     sentTime: "just now",
    //     sender: "ChatGPT",
    //   };

    /* 設定訓練的資料三秒後回覆 */
    //   setTimeout(() => {
    //     setMessages([...newMessages, responseMessage]);
    //     setIsTyping(false);
    //   }, 3000);
    //   return;
    // }
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo", // 定義模型
      messages: [
        systemMessage, // 定義人設
        ...apiMessages,
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <main className="main">
      <div className="gpt_container">
        <div className="content">
          <div className="text-content">
            <div className="home text chatgpt">
              <div className="title">AI個人助理</div>
              <div className="message">
                <MainContainer>
                  <ChatContainer>
                    <MessageList
                      scrollBehavior="smooth"
                      typingIndicator={
                        isTyping ? (
                          <TypingIndicator content="客服回應中" />
                        ) : null
                      }
                    >
                      {messages.map((message, i) => {
                        console.log(message);
                        return <Message key={i} model={message} />;
                      })}
                    </MessageList>
                    <MessageInput
                      placeholder="請輸入問題"
                      onSend={handleSend}
                    />
                  </ChatContainer>
                </MainContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChatGpt;
