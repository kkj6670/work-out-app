import { useCallback, useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { WorkOutItem } from "./WorkOuts";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (item: WorkOutItem) => void;
}

const MAX_TITLE_LENGTH = 20;
const MIN_DURATION = 15;
const MAX_DURATION = 60;

export const WorkOutAddModal = ({ open, onClose, onConfirm }: Props) => {
  const [workOutItem, setWorkOutItem] = useState<WorkOutItem>({ title: "", duration: 30 });

  useEffect(() => {
    if (!open) {
      // duration은 마지막 사용한거 저장, title만 초기화
      setWorkOutItem((prev) => ({ ...prev, title: "" }));
    }
  }, [open]);

  const handleInputChange = useCallback((type: keyof WorkOutItem, text: string) => {
    if (type === "title") {
      setWorkOutItem((prev) => ({ ...prev, [type]: text }));
    }

    if (type === "duration") {
      const duration = text.length === 0 ? 0 : Number(text);
      if (!Number.isNaN(duration)) {
        setWorkOutItem((prev) => ({ ...prev, [type]: duration }));
      }
    }
  }, []);

  const handleConfirm = () => {
    if (workOutItem.title.length === 0) {
      Alert.alert("타이틀은 필수 입니다.");
      return;
    }

    if (workOutItem.title.length > MAX_TITLE_LENGTH) {
      Alert.alert(`타이틀은 최대 ${MAX_TITLE_LENGTH}자 입니다.`);
      return;
    }

    if (workOutItem.duration < MIN_DURATION) {
      Alert.alert(`시간은 최소 ${MIN_DURATION}초 입니다.`);
      return;
    }

    if (workOutItem.duration > MAX_DURATION) {
      Alert.alert(`시간은 최대 ${MAX_DURATION}초 입니다.`);
      return;
    }

    onConfirm(workOutItem);
    onClose();
  };

  return (
    <Modal animationType="fade" visible={open} transparent onRequestClose={onClose}>
      <View style={styles.centerView}>
        <View style={styles.contents}>
          <Text style={styles.heading}>WorkOut 추가</Text>
          <View>
            <Text style={styles.inputLabel}>Title ({`최대 ${MAX_TITLE_LENGTH}자`})</Text>
            <TextInput
              placeholder="제목을 입력해 주세요."
              keyboardType="default"
              maxLength={MAX_TITLE_LENGTH}
              value={workOutItem.title}
              onChangeText={(text) => handleInputChange("title", text)}
            />
          </View>
          <View>
            <Text style={styles.inputLabel}>Duration ({`${MIN_DURATION} ~ ${MAX_DURATION}초`})</Text>
            <TextInput
              placeholder="시간을 입력해 주세요."
              keyboardType="number-pad"
              value={workOutItem.duration.toString()}
              onChangeText={(text) => handleInputChange("duration", text)}
            />
          </View>
          <View style={styles.footerBtnWrap}>
            <Pressable style={styles.footerBtn} onPress={onClose}>
              <Text>닫기</Text>
            </Pressable>
            <Pressable style={{ ...styles.footerBtn, ...styles.footerBtnAccent }} onPress={handleConfirm}>
              <Text>추가</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    marginTop: 200,
    alignItems: "center",
  },
  contents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 15,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    maxWidth: 350,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  footerBtnWrap: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 10,
  },
  footerBtn: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  footerBtnAccent: {
    backgroundColor: "#e1f0ff",
  },
});
