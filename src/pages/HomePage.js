import ButtonPlan from "../components/ButtonPlan";
import ButtonSection from "../components/ButtonSection";
import Header from "../components/Header";
import Invoices from "../components/Invoices";
import { HiUserGroup } from 'react-icons/hi2';
import { HiDocumentText } from 'react-icons/hi2';
import { HiUserPlus } from 'react-icons/hi2';
import imgSeraphisPremium from '../media/seraphis-premium.png';
import imgMaatPremium from '../media/maat-premium.png';
import imgMaatSeraphisPremium from '../media/ms-gold.png';

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
            path="/clients"
          />
          <ButtonSection
            title="Novo cliente"
            image={ <HiUserPlus /> }
            path="/"
          />
          <ButtonSection
            title="Faturas"
            image={ <HiDocumentText /> }
            path="/"
          />
        </section>
        <section className="flex flex-wrap justify-around p-5 mt-5 border-t-2 border-gray-400">
          <ButtonPlan title="Premium Seraphis" image={imgSeraphisPremium} />
          <ButtonPlan title="Premium Maat" image={imgMaatPremium} />
          <ButtonPlan title="Gold Seraphis/Maat" image={imgMaatSeraphisPremium} />
        </section>
      </main>
    </>
  )
}

export default HomePage;
