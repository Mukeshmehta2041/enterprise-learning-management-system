import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { AppText } from '../../src/components/AppText'
import { useRealtime } from '../../src/hooks/useRealtime'
import { useAuthStore } from '../../src/state/useAuthStore'
import { Ionicons } from '@expo/vector-icons'

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: string
}

export default function ChatScreen() {
  const { channelId, channelName } = useLocalSearchParams()
  const { user } = useAuthStore()
  const { isConnected, emit, on } = useRealtime('/chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    if (!isConnected) return

    // Join the channel
    emit('join', { channelId })

    // Listen for new messages
    const unsubscribe = on('message', (message: Message) => {
      setMessages((prev) => [...prev, message])
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100)
    })

    return () => {
      unsubscribe()
      emit('leave', { channelId })
    }
  }, [isConnected, channelId])

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage = {
      channelId,
      text: inputText,
    }

    emit('sendMessage', newMessage)
    setInputText('')
  }

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.id
    return (
      <View className={`mb-4 max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}>
        {!isMe && (
          <AppText variant="small" color="muted" className="mb-1 ml-1">
            {item.senderName}
          </AppText>
        )}
        <View
          className={`p-4 rounded-2xl ${isMe ? 'bg-primary rounded-tr-none' : 'bg-slate-100 rounded-tl-none'}`}
        >
          <AppText
            color={isMe ? 'primary' : 'default'}
            style={{ color: isMe ? '#fff' : '#0f172a' }}
          >
            {item.text}
          </AppText>
        </View>
        <AppText variant="small" color="muted" className="mt-1 self-end text-[10px]">
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </AppText>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen options={{ title: (channelName as string) || 'Live Chat' }} />

      {!isConnected && (
        <View className="bg-amber-50 p-2 items-center">
          <AppText variant="small" className="text-amber-800">
            Connecting to live sessions...
          </AppText>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="chatbubbles-outline" size={48} color="#cbd5e1" />
            <AppText color="muted" className="mt-4">
              Start the conversation!
            </AppText>
          </View>
        }
      />

      <View className="p-4 border-t border-slate-100 flex-row items-center bg-white mb-2">
        <TextInput
          className="flex-1 h-12 bg-slate-100 rounded-2xl px-4 mr-3"
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          className={`w-12 h-12 rounded-full items-center justify-center ${inputText.trim() ? 'bg-primary' : 'bg-slate-200'}`}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
