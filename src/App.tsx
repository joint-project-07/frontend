import Card from "./components/common/CardComponent";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Card
        image=""
        title="펫모어핸즈 봉사센터"
        region="지역:"
        date="일자:"
        volunteerwork="봉사활동명:"
      />
    </div>
  );
}

export default App;
