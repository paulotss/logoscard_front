import Header from "../components/Header";
import Invoices from "../components/Invoices";

const HomePage = () => {
  return (
    <>
      <Header />
      <main className="p-5">
        <p className="font-bold mb-3">Faturas</p>
        <Invoices />
      </main>
    </>
  )
}

export default HomePage;
