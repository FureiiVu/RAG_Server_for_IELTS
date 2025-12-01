import { Route, Routes } from "react-router-dom";
import ServerControllerPage from "./pages/serverControllerPage.tsx";
import IeltsWritingAssessPage from "./pages/ieltsWritingAssessPage.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/server-controller" element={<ServerControllerPage />} />
        <Route
          path="/ielts-writing-assess"
          element={<IeltsWritingAssessPage />}
        />
      </Routes>
    </>
  );
}

export default App;
