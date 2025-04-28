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
              backgroundColor: Colors[colorScheme ?? "light"].pocketTripPrimary,
            },
          ]}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your trip..."
          placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          multiline
        />
        <Pressable
          onPress={sendMessage}
          style={({ pressed }) => [
            styles.sendButton,
            {
              backgroundColor:
                input.trim() === ""
                  ? Colors[colorScheme ?? "light"].icon
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
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 79, 255, 0.1)',
    backgroundColor: Colors.light.pocketTripPrimary,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 140 : 120,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
    maxWidth: "85%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.light.pocketTripAccent,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.pocketTripPrimary,
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: Platform.OS === 'ios' ? 25 : 15,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: 'rgba(138, 79, 255, 0.1)',
    backgroundColor: Colors.light.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(138, 79, 255, 0.3)',
    fontSize: 16,
    minHeight: 48,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  welcomeContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeIcon: {
    marginBottom: 24,
    backgroundColor: Colors.light.pocketTripPrimary,
    padding: 16,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    color: Colors.light.text,
  },
  suggestionsTitle: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  suggestionList: {
    width: "100%",
    gap: 12,
  },
  suggestionItem: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.light.pocketTripPrimary,
    borderWidth: 1,
    borderColor: 'rgba(138, 79, 255, 0.2)',
  },
});
