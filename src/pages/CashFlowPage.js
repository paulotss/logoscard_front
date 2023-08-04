import Header from "../components/Header";

const CashFlowPage = () => {
  return (
    <>
      <Header />
      <main className="p-5">
        <section className="mb-3">
          <h1 className="font-bold">Saídas</h1>
          <h2 className="italic">Últimas 5</h2>
        </section>
        <section className="mb-3">
          <h1 className="font-bold">Entradas</h1>
          <h2 className="italic">Últimas 5</h2>
        </section>
      </main>
    </>
  )
}

export default CashFlowPage;
