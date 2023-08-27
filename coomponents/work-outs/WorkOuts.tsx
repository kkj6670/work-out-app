import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { WorkOutAddModal } from "./WorkOutAddModal";

export interface WorkOutItem {
  title: string;
  duration: number;
}

interface ActiveWorkOut {
  index: number;
  currentTime: number;
  duration: number;
  isPause: boolean;
}

const MAX_WORK_OUT_LENGTH = 10;
const PROGRESS_VIEW_SEC = 1;

export const WorkOuts = () => {
  const [workOuts, setWorkOuts] = useState<WorkOutItem[]>([]);
  const [activeWorkOut, setActiveWorkOut] = useState<ActiveWorkOut | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    // workOut timer 실행
    if (activeWorkOut !== null && !activeWorkOut.isPause) {
      const timerId = setInterval(() => {
        setActiveWorkOut((prev) => {
          if (prev === null) return null;

          // workOut 시간 진행
          const next = { ...prev, currentTime: prev.currentTime + PROGRESS_VIEW_SEC };
          const isLastIdx = next.index === workOuts.length - 1;
          const isLastTime = next.currentTime === next.duration;

          if (!isLastIdx && isLastTime) {
            // 다음 workOut 시작
            next.index = next.index += 1;
            next.currentTime = 0;
            next.duration = workOuts[next.index].duration;
          }

          if (isLastIdx && isLastTime) {
            // workOut 종료
            let runningTimeSec = workOuts.reduce((acc, cur) => acc + cur.duration, 0);
            const runningTimeMinute = Math.floor(runningTimeSec / 60);
            runningTimeSec -= runningTimeMinute * 60;

            const minuteText = runningTimeMinute > 0 ? `${runningTimeMinute}분` : "";
            const secText = runningTimeSec > 0 ? `${runningTimeSec}초` : "";

            Alert.alert(
              "운동이 종료 되었습니다.",
              `수고 하셨습니다.\n진행 운동수: ${workOuts.length}개\n진행 시간: ${minuteText}${secText}`
            );
            return null;
          }

          return next;
        });
      }, PROGRESS_VIEW_SEC * 1000);

      return () => clearInterval(timerId);
    }
  }, [activeWorkOut, workOuts]);

  const handleRemove = useCallback((idx: number) => {
    setWorkOuts((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleAdd = useCallback((item: WorkOutItem) => {
    setWorkOuts((prev) => [...prev, { title: item.title, duration: item.duration }]);
  }, []);

  const handleStart = useCallback(() => {
    const firstWorkOut = workOuts[0];
    if (firstWorkOut) {
      setActiveWorkOut({ index: 0, currentTime: 0, duration: workOuts[0].duration, isPause: false });
    }
  }, [workOuts]);

  const handleStop = useCallback(() => {
    setActiveWorkOut(null);
  }, []);

  const handlePause = useCallback(() => {
    setActiveWorkOut((prev) => {
      if (prev === null) return null;

      return {
        ...prev,
        isPause: !prev.isPause,
      };
    });
  }, []);

  const handleAddClick = useCallback(() => {
    if (workOuts.length === MAX_WORK_OUT_LENGTH) {
      Alert.alert(`최대 ${MAX_WORK_OUT_LENGTH}개 까지 추가 가능합니다.`);
    } else {
      setOpenAddModal(true);
    }
  }, [workOuts.length]);

  return (
    <View style={styles.container}>
      <FlatList
        data={workOuts}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={
          activeWorkOut === null ? (
            <Pressable style={{ ...styles.workOutItem, justifyContent: "center" }} onPress={handleAddClick}>
              <Text>+</Text>
            </Pressable>
          ) : undefined
        }
        renderItem={({ item, index }) => {
          const isActive = activeWorkOut !== null && activeWorkOut.index === index;
          const isEnd = index < (activeWorkOut?.index || 0);
          const isBgShow = isActive || isEnd;

          return (
            <View key={index} style={styles.workOutItem}>
              {isBgShow && (
                <View style={styles.workOutItemProgressBarWrap}>
                  <View
                    style={{
                      ...styles.workOutItemProgressBar,
                      width: `${isActive ? (activeWorkOut.currentTime / activeWorkOut.duration) * 100 : 100}%`,
                    }}
                  />
                </View>
              )}
              <Text>
                {item.title} - {item.duration}초
              </Text>
              {activeWorkOut === null && (
                <Pressable onPress={() => handleRemove(index)}>
                  <Text>삭제</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
      <View style={styles.statusButtonWrap}>
        {activeWorkOut === null ? (
          <Pressable style={styles.statusButton} onPress={handleStart} disabled={workOuts.length === 0}>
            <Text>Start</Text>
          </Pressable>
        ) : (
          <View style={styles.afterStartButtonWrap}>
            <Pressable style={styles.statusButton} onPress={handlePause}>
              <Text>{activeWorkOut.isPause ? "Resume" : "Pause"}</Text>
            </Pressable>
            <Pressable style={styles.statusButton} onPress={handleStop}>
              <Text>Stop</Text>
            </Pressable>
          </View>
        )}
      </View>
      <WorkOutAddModal open={openAddModal} onClose={() => setOpenAddModal(false)} onConfirm={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
  workOutItem: {
    position: "relative",
    height: 45,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#e1f0ff",
    borderColor: "#d7dbdf",
    borderWidth: 1,
  },
  workOutItemProgressBarWrap: {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    zIndex: -1,
  },
  workOutItemProgressBar: {
    height: "100%",
    backgroundColor: "#e6e6e6",
  },
  statusButtonWrap: {
    width: "100%",
    height: 50,
    fontSize: 20,
  },
  statusButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#d7dbdf",
    backgroundColor: "#f8f9fa",
  },
  afterStartButtonWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
});
