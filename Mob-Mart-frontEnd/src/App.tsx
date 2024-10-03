import AppRouter from "./routes/router";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => (

 <Provider store={store}>
    <AppRouter />
  </Provider>

  );


export default App;
