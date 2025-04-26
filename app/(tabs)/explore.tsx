import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface Message {
  text: string;
  isUser: boolean;
}

export default function ExploreScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();

  const sendMessage = async () => {
    if (input.trim() === "") return;
  
    const userMessage: Message = { text: input, isUser: true };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);
  
    try {
      const response = await fetch(
        "https://api.langflow.astra.datastax.com/lf/16531e39-cb22-4025-a6ed-3a91c323004f/api/v1/run/f5f2aa6d-349e-414f-a6ba-868e72448d2f?stream=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer AstraCS:rvCdKJOqenYduJMaEQbNYpGk:a047ae6ebbb8a20a846a3e63445fb0d34045dae628e71fa24f34c999a72f4619",
          },
          body: JSON.stringify({
            input_value: input,
            output_type: "chat",
            input_type: "chat"
          }),
        }
      );
  
      const data = await response.json();
      console.log("LangFlow response:", data);
  
      let finalText = "I couldn't process that. Please try again.";
  
      // Extract text from the nested response structure
      if (data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text) {
        finalText = data.outputs[0].outputs[0].results.message.text;
        
        // Clean up markdown formatting
        finalText = finalText.replace(/\*\*/g, '').trim();
      } 
      // Fallback to content_blocks if needed
      else if (data?.outputs?.[0]?.outputs?.[0]?.results?.message?.content_blocks?.[0]?.contents?.[1]?.text) {
        finalText = data.outputs[0].outputs[0].results.message.content_blocks[0].contents[1].text;
        finalText = finalText.replace(/\*\*/g, '').trim();
      }
  
      const botResponse: Message = {
        text: finalText,
        isUser: false,
      };
  
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ThemedView style={styles.header}>
        <IconSymbol
          name="globe"
          size={24}
          color={Colors[colorScheme ?? "light"].pocketTripAccent}
        />
        <ThemedText
          type="title"
          style={{ color: Colors[colorScheme ?? "light"].pocketTripAccent }}
        >
          PocketTrip AI Trip Planner
        </ThemedText>
      </ThemedView>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.length === 0 ? (
          <ThemedView style={styles.welcomeContainer}>
            <IconSymbol
              name="sparkles"
              size={50}
              color={Colors[colorScheme ?? "light"].pocketTripAccent}
              style={styles.welcomeIcon}
            />
            <ThemedText style={styles.welcomeText}>
              Welcome to PocketTrip AI! Ask me anything about planning your next
              trip.
            </ThemedText>
            <ThemedText style={styles.suggestionsTitle}>Try asking:</ThemedText>
            <ThemedView style={styles.suggestionList}>
              <ThemedView style={styles.suggestionItem}>
                <ThemedText>"Plan a weekend trip to Paris"</ThemedText>
              </ThemedView>
              <ThemedView style={styles.suggestionItem}>
                <ThemedText>
                  "What should I pack for a beach vacation?"
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.suggestionItem}>
                <ThemedText>"Find budget-friendly hotels in Tokyo"</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ) : (
          messages.map((message, index) => (
            <ThemedView
              key={index}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.botMessage,
              ]}
            >
              <ThemedText
                style={{
                  color: message.isUser
                    ? "#FFFFFF"
                    : Colors[colorScheme ?? "light"].text,
                }}
              >
                {message.text}
              </ThemedText>
            </ThemedView>
          ))
        )}
        {isLoading && (
          <ThemedView style={[styles.messageBubble, styles.botMessage]}>
            <ActivityIndicator
              size="small"
              color={Colors[colorScheme ?? "light"].text}
            />
          </ThemedView>
        )}
      </ScrollView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: Colors[colorScheme ?? "light"].text,
              backgroundColor: colorScheme === "dark" ? "#1c1c1e" : "#f2f2f7",
            },
          ]}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your trip..."
          placeholderTextColor={Colors[colorScheme ?? "light"].tabIconDefault}
          multiline
        />
        <Pressable
          onPress={sendMessage}
          style={({ pressed }) => [
            styles.sendButton,
            {
              backgroundColor:
                input.trim() === ""
                  ? Colors[colorScheme ?? "light"].tabIconDefault
                  : Colors[colorScheme ?? "light"].pocketTripAccent,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          disabled={input.trim() === ""}
        >
          <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
        </Pressable>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgb(236,226,251)",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "80%",
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#8A4FFF",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgb(236,226,251)",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 40,
    marginBottom: 35,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  welcomeIcon: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  suggestionsTitle: {
    marginBottom: 12,
    fontWeight: "bold",
  },
  suggestionList: {
    width: "100%",
    gap: 10,
  },
  suggestionItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
});
