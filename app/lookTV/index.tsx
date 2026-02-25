import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Card,
  H3,
  Image,
  Paragraph,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "tamagui";

interface TvItem {
  name: string;
  url: string;
  icon: string;
  analysisUrlList: string[];
  remark: string;
  injectionSc: string;
}

export default function ModuleBHome() {
  const router = useRouter();

  const [tvList, setTvList] = useState<TvItem[]>([]);

  useEffect(() => {
    const list: TvItem[] = [
      {
        name: "腾讯视频",
        url: "https://v.qq.com/",
        icon: "https://imgcache.qq.com/tencentvideo_v1/cover/cover.png",
        analysisUrlList: ["https://解析1.com"],
        remark: "国内主流视频平台",
        injectionSc: "",
      },
      {
        name: "爱奇艺",
        url: "https://www.iq.com/",
        icon: "https://www.iq.com/logo.png",
        analysisUrlList: ["https://解析2.com"],
        remark: "高清影视资源丰富",
        injectionSc: "",
      },
      {
        name: "优酷",
        url: "https://www.youku.com/",
        icon: "https://www.youku.com/logo.png",
        analysisUrlList: ["https://解析3.com"],
        remark: "阿里旗下视频平台",
        injectionSc: "",
      },
      {
        name: "B站",
        url: "https://www.bilibili.com/",
        icon: "https://www.bilibili.com/favicon.ico",
        analysisUrlList: ["https://解析4.com"],
        remark: "年轻弹幕视频网站",
        injectionSc: "",
      },
      {
        name: "芒果TV",
        url: "https://www.mgtv.com/",
        icon: "https://www.mgtv.com/favicon.ico",
        analysisUrlList: ["https://解析5.com"],
        remark: "湖南卫视官方平台",
        injectionSc: "",
      },
    ];
    setTvList(list);
  }, []);

  const handleItemPress = (item: TvItem) => {
    console.log("点击了:", item.name);
    router.push("/modal");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 16 }}>
      <YStack gap={12}>
        {tvList.map((item, index) => (
          <Card
            key={index}
            bordered
            size="$4"
            backgroundColor="#fff"
            borderRadius={12}
            padding={12}
            onPress={() => handleItemPress(item)}
            pressStyle={{ opacity: 0.8, scale: 0.98 }}
          >
            <XStack gap={12} justify="center">
              <Image
                source={{ uri: item.icon || "https://via.placeholder.com/50" }}
                width={50}
                height={50}
                borderRadius={8}
              />
              <YStack flex={1} gap={4}>
                <H3 size="$5">{item.name}</H3>
                <Paragraph size="$2" color="gray">
                  {item.remark}
                </Paragraph>
                <Text fontSize={12} color="#999">
                  {item.analysisUrlList.length} 个解析源
                </Text>
              </YStack>
              <Text color="gray">{" > "}</Text>
            </XStack>
          </Card>
        ))}
      </YStack>
    </ScrollView>
  );
}
