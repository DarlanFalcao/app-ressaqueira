import React, { useState } from 'react';
import { Button, Overlay, Text } from 'react-native-elements';
import { View, ActivityIndicator, Modal } from 'react-native';

export const Teste = () => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View>
      <Button title="Open Overlay" onPress={toggleOverlay} />

      <Overlay isVisible={visible}  ModalComponent={Modal}>
        <ActivityIndicator color="red"></ActivityIndicator>
        <Text>Hello from Overlay!</Text>
        <Button title = 'Fechar' onPress={toggleOverlay}></Button>
      </Overlay>
    </View>
  );
};