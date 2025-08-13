import { icons } from "@/constants/icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

const TabIcon = ({
  focused,
  icon,
  title
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => {
  if (!focused) {
    return (
      <View className="size-full items-center justify-center rounded-full">
        <Image source={icon} className="size-5" tintColor="#a8b5db" />
      </View>
    );
  }

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["#D6C7FF", "#AB8BFF"]}
      className="flex h-full min-h-14 w-full min-w-[112px] flex-1 flex-row items-center justify-center overflow-hidden rounded-full"
    >
      <Image source={icon} tintColor="#151312" className="size-5" />
      <Text className="ml-2 text-base font-semibold text-secondary">
        {title}
      </Text>
    </LinearGradient>
  );
};

const navItems = [
  {
    name: "index",
    title: "Home",
    icon: icons.home
  },
  {
    title: "Search",
    icon: icons.search
  },
  {
    title: "Saved",
    icon: icons.save
  },
  {
    title: "Profile",
    icon: icons.person
  }
];

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        },
        tabBarStyle: {
          backgroundColor: "#0f0d23",
          borderRadius: 50,
          marginHorizontal: 20,
          paddingHorizontal: 25,
          paddingTop: 12,
          marginBottom: 20,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0f0d23"
        }
      }}
    >
      {navItems.map((item, index) => (
        <Tabs.Screen
          key={index}
          name={item.name || item.title.toLowerCase()}
          options={{
            title: item.title,
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={item.icon} title={item.title} />
            )
          }}
        />
      ))}
    </Tabs>
  );
};

export default _Layout;
