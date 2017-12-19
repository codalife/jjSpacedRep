import React from 'react';
import { Animated, Text, View, TouchableOpacity, Image, CameraRoll } from 'react-native';
import { Camera, Permissions, Video } from 'expo';
import { Ionicons } from '@expo/vector-icons';

export default class Recorder extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    recording: false,
    animatedStartValue: new Animated.Value(1),
    color: 'green',
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {

      return (
        <View style={{ flex: 1 }}>
          <Camera 
            style={{ flex: 1 }} 
            type={this.state.type}
            ref={ref => { this.camera = ref; }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                alignContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.record();
                }}>
                <Animated.View style={{
                    opacity: this.state.animatedStartValue
                  }} >
                  <Ionicons name="ios-videocam" size={32} color={this.state.color} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }

  record = async () => {
    this.setState({
      recording: !this.state.recording
    })
    if (this.camera && !this.state.recording) {

      this.setState({
        recording: true,
        color: 'blue'
      });

      const blink = Animated.loop(
        Animated.sequence([
          Animated.timing(
            this.state.animatedStartValue,
            {
              toValue: 0,
              duration: 1000,
            }
          ),
          Animated.timing(
            this.state.animatedStartValue,
            {
              toValue: 1,
              duration: 500,
            }
          )
        ]) 
      )

      blink.start();

      let video = await this.camera.recordAsync();

      this.setState({
        color: 'green'
      });

      blink.stop();

      this.props.navigation.navigate('EnterData', { uri: video.uri });
    } else {
      this.camera.stopRecording();
    }
  }
}