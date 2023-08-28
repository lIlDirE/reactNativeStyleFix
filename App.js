import React from 'react';
import { Provider, useSelector} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Redux/store'; // Проверьте путь к вашему store
import "react-native-gesture-handler";
import { Main } from './Components/Main';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {

  return (
	<GestureHandlerRootView style={{ flex: 1 }}>
	<Provider store={store}>
	   <PersistGate loading={null} persistor={persistor}>
		  <Main />
	   </PersistGate>
	</Provider>
 </GestureHandlerRootView>
  );
}
