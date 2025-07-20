import { useEffect, useState } from 'react';
import TrunkFilter from '../TrunkComponents/TrunkFilter';
import TrunkListing from '../TrunkComponents/TrunkListing';
import TrunkNav from '../TrunkComponents/TrunkNav';

export default function TrunkArea({ cards, setCards, setCurrentCard }) {
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 30;

  useEffect(() => {
    fetch('/cards/TenguPlant.json')
      .then(res => res.json())
      .then(data => setCards(data.data))
      .catch(err => console.error('Error loading cards:', err));
  }, [setCards]);

  const maxPages = Math.ceil(cards.length / cardsPerPage);
  const start = currentPage * cardsPerPage;
  const end = start + cardsPerPage;
  const visibleCards = cards.slice(start, end);

  return (
    <div className="trunk-area">
      <TrunkFilter />
      <TrunkListing cards={visibleCards} setCurrentCard={setCurrentCard} />
      <TrunkNav currentPage={currentPage} setCurrentPage={setCurrentPage} maxPages={maxPages} />
    </div>
  );
}
