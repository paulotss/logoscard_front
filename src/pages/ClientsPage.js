import Header from "../components/Header";

const ClientsPage = () => {
  return (
    <>
      <Header />
      <main className="p-5">
        <p className="font-bold mb-3">Clientes</p>
        <div className="w-full">
          <div className="grid grid-gap grid-cols-4 grid-rows-1  p-2">
            <div>Inscrição</div>
            <div className="col-span-2">Nome</div>
            <div className="text-center">Status</div>
          </div>
          <div className="grid grid-gap grid-cols-4 grid-rows-1 bg-gray-400 rounded-lg p-2">
            <div>200568</div>
            <div className="col-span-2">Paulo de Tarso Soares Silva</div>
            <div className="text-center">ok</div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ClientsPage;
