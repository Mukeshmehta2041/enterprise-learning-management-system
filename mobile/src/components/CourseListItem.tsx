import { TouchableOpacity, View, Image } from "react-native";
import { AppText } from "./AppText";
import { Badge } from "./Badge";
import { Ionicons } from "@expo/vector-icons";

interface Course {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  thumbnailUrl?: string;
  category?: string;
  level?: string;
  rating?: number;
}

interface CourseListItemProps {
  course: Course;
  onPress: () => void;
}

export function CourseListItem({ course, onPress }: CourseListItemProps) {
  return (
    <TouchableOpacity
      className="bg-card rounded-2xl mb-4 overflow-hidden shadow-sm border border-slate-100"
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View className="h-40 bg-slate-200">
        {course.thumbnailUrl ? (
          <Image
            source={{ uri: course.thumbnailUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Ionicons name="school-outline" size={48} color="#94a3b8" />
          </View>
        )}
      </View>
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          {course.category && (
            <Badge label={course.category} variant="primary" />
          )}
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#f59e0b" />
            <AppText variant="small" className="ml-1 font-medium">
              {course.rating || 4.5}
            </AppText>
          </View>
        </View>
        <AppText variant="h3" className="mb-1" numberOfLines={2}>
          {course.title}
        </AppText>
        <AppText variant="caption" color="muted" className="mb-3">
          by {course.instructorName}
        </AppText>
        <View className="flex-row items-center justify-between mt-auto">
          {course.level && (
            <View className="flex-row items-center">
              <Ionicons name="stats-chart-outline" size={14} color="#64748b" />
              <AppText variant="small" color="muted" className="ml-1">
                {course.level}
              </AppText>
            </View>
          )}
          <AppText variant="body" weight="bold" color="primary">
            View Details
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
