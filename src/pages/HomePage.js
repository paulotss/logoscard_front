import { useEffect, useState } from "react";
import axios from "../http";
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
  const [ total, setTotal ] = useState({
    clients: 0,
    dependents: 0,
  })

  useEffect(() => {
    const getTotal = async () => {
      const clients = await axios.get('/api/clients/clients/total');
      const dependents = await axios.get('/api/dependents/dependents/total');
      setTotal({
        clients: clients.data,
        dependents: dependents.data,
      });
    }
    getTotal();
  }, []);

  return (
    <>
      <Header />
      <main className="p-5">
          <p className="font-bold mb-3 text-center">Faturas</p>
          <Invoices />
        <section className="flex justify-center mt-5">
          <div className="m-5 text-center">
            <p className="font-bold">Titulares</p>
            <p className="font-bold text-green-600 text-2xl">{ total.clients }</p>
          </div>
          <div className="m-5 text-center">
            <p className="font-bold">Dependentes</p>
            <p className="font-bold text-green-600 text-2xl">{ total.dependents }</p>
          </div>
        </section>
        <section className="flex justify-center p-5 border-t-2 border-gray-400">
          <ButtonSection
            title="Clientes"
            image={ <HiUserGroup /> }
            path="/clients"
          />
            <ButtonSection
              title="Novo cliente"
              image={ <HiUserPlus /> }
              path="/client/create"
            />
          <ButtonSection
            title="Dependentes"
            image={ <HiUserGroup /> }
            path="/dependents"
          />
            <ButtonSection
              title="Caixa"
              image={ <HiDocumentText /> }
              path="/cashflow"
            />
        </section>
        <section className="flex flex-wrap justify-center p-5 mt-5 border-t-2 border-gray-400">
          <ButtonPlan title="Premium Seraphis" image={imgSeraphisPremium} />
          <ButtonPlan title="Premium Maat" image={imgMaatPremium} />
          <ButtonPlan title="Gold Seraphis/Maat" image={imgMaatSeraphisPremium} />
        </section>
      </main>
    </>
  )
}

export default HomePage;
