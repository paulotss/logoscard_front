import ButtonSection from "../components/ButtonSection";
import Header from "../components/Header";
import Invoices from "../components/Invoices";
import { HiUserGroup } from 'react-icons/hi2';
import { HiDocumentText } from 'react-icons/hi2';
import { HiRectangleGroup } from 'react-icons/hi2';

const HomePage = () => {
  return (
    <>
      <Header />
      <main className="p-5">
        <p className="font-bold mb-3">Faturas</p>
        <Invoices />
        <section className="flex justify-around p-5 mt-5 border-t-2 border-gray-400">
          <ButtonSection
            title="Clientes"
            image={ <HiUserGroup /> }
            path="/"
          />
          <ButtonSection
            title="Faturas"
            image={ <HiDocumentText /> }
            path="/"
          />
          <ButtonSection
            title="Planos"
            image={ <HiRectangleGroup /> }
            path="/"
          />
        </section>
      </main>
    </>
  )
}

export default HomePage;
