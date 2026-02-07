import React from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../src/components/AppText';
import { useInstructorAssignments } from '../../../src/hooks/useInstructor';

export default function InstructorAssignmentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: assignments, isLoading, refetch } = useInstructorAssignments(id!);

  const renderAssignmentItem = ({ item }: { item: any }) => {
    const submissionRate = item.totalEnrollments > 0
      ? Math.round((item.submittedCount / item.totalEnrollments) * 100)
      : 0;

    return (
      <TouchableOpacity
        className="bg-white mx-4 mb-3 p-4 rounded-xl border border-slate-100 shadow-sm"
        onPress={() => router.push(`/instructor-course/${id}/assignments/${item.id}`)}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-2">
            <AppText className="text-slate-900 font-bold text-lg mb-1">{item.title}</AppText>
            <AppText className="text-slate-500 text-xs">Due: {new Date(item.dueDate).toLocaleDateString()}</AppText>
          </View>
          <View className="bg-indigo-50 px-2 py-1 rounded">
            <AppText className="text-indigo-600 text-[10px] font-bold">ACTIVE</AppText>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1 mr-4">
            <View className="flex-row justify-between mb-1">
              <AppText className="text-slate-500 text-xs">Submission Rate</AppText>
              <AppText className="text-slate-700 text-xs font-bold">{submissionRate}%</AppText>
            </View>
            <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <View
                className="h-full bg-indigo-500"
                style={{ width: `${submissionRate}%` }}
              />
            </View>
          </View>
        </View>

        <View className="flex-row justify-between border-t border-slate-50 pt-3">
          <View className="items-center flex-1">
            <AppText className="text-slate-900 font-bold">{item.submittedCount}</AppText>
            <AppText className="text-slate-400 text-[10px]">SUBMITTED</AppText>
          </View>
          <View className="w-[1px] bg-slate-100" />
          <View className="items-center flex-1">
            <AppText className="text-slate-900 font-bold">{item.gradedCount}</AppText>
            <AppText className="text-slate-400 text-[10px]">GRADED</AppText>
          </View>
          <View className="w-[1px] bg-slate-100" />
          <View className="items-center flex-1">
            <AppText className="text-slate-900 font-bold">{item.totalEnrollments - item.submittedCount}</AppText>
            <AppText className="text-slate-400 text-[10px]">PENDING</AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{
        title: 'Course Assignments',
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push(`/instructor-course/${id}/assignments/create`)}>
            <Ionicons name="add" size={24} color="#4f46e5" />
          </TouchableOpacity>
        )
      }} />

      <FlatList
        data={assignments}
        renderItem={renderAssignmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={() => !isLoading && (
          <View className="items-center justify-center py-20 px-10">
            <View className="bg-slate-200 w-16 h-16 rounded-full items-center justify-center mb-4">
              <Ionicons name="clipboard-outline" size={32} color="#64748b" />
            </View>
            <AppText className="text-slate-900 font-bold text-lg text-center mb-2">No Assignments</AppText>
            <AppText className="text-slate-500 text-center">You haven't added any assignments to this course yet.</AppText>
          </View>
        )}
      />
    </View>
  );
}
