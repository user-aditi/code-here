import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
// highlight.js CSS is usually required for syntax highlighting to actually look styled.
// Since we are using tailwind and DaisyUI, we'll import a standard dark theme if available,
// but since we might not have 'highlight.js' package installed directly, we might need to rely on generic classes or install it.
// We'll assume rehypeHighlight adds standard hljs classes which we can style, or we can just let it be for now.

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi! How can I help you with this problem?"}]}
    ]);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        
        setMessages(prev => [...prev, { role: 'user', parts:[{text: data.message}] }]);
        reset();

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages:messages,
                title:problem.title,
                description:problem.description,
                testCases: problem.visibleTestCases,
                startCode:problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Error from AI Chatbot"}]
            }]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-base-200/20 backdrop-blur-md relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className={`chat-bubble ${msg.role === "user" ? "bg-primary text-primary-content" : "bg-base-300/80 backdrop-blur-xl border border-white/10 text-base-content prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-p:leading-relaxed"}`}>
                            {msg.role === "model" ? (
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {msg.parts[0].text}
                                </ReactMarkdown>
                            ) : (
                                msg.parts[0].text
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-base-200/50 backdrop-blur-xl border-t border-white/5 sticky bottom-0">
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex items-center gap-2"
                >
                    <input 
                        placeholder="Ask me anything about your code..." 
                        className="input input-bordered flex-1 bg-base-100/50 focus:bg-base-100 transition-colors border-white/10" 
                        {...register("message", { required: true, minLength: 2 })}
                        autoComplete="off"
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-circle shadow-lg hover:shadow-primary/25 transition-all"
                        disabled={errors.message}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatAi;