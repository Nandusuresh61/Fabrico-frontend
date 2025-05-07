import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWallet, getWalletTransactions } from '../../../redux/features/walletSlice';

const Wallet = () => {
  const dispatch = useDispatch();
  const { wallet, transactions, loading, error, pagination } = useSelector((state) => state.wallet);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    dispatch(getWallet());
    dispatch(getWalletTransactions(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Wallet</h2>
        {/* <CustomButton variant="outline" size="sm">
          Add Money
        </CustomButton> */}
      </div>
      
      <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Current Balance</p>
            <h3 className="mt-1 text-3xl font-bold">{formatCurrency(wallet?.balance || 0)}</h3>
          </div>
          <WalletIcon className="h-10 w-10 text-white/90" />
        </div>
        
        <div className="mt-6 flex gap-2">
          {/* <CustomButton size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            Withdraw
          </CustomButton>
          <CustomButton size="sm" className="bg-white text-primary hover:bg-white/90">
            Add Money
          </CustomButton> */}
        </div>
      </div>
      
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium">Recent Transactions</h3>
        </div>
        
        {transactions?.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' 
                      ? <ArrowUpRight className="h-5 w-5" /> 
                      : <ArrowDownLeft className="h-5 w-5" />}
                  </div>
                  
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)} • {transaction.id}</p>
                  </div>
                </div>
                
                <div className={`font-medium ${
                  transaction.type === 'credit' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
            
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
            <WalletIcon className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No Transactions Yet</h3>
            <p className="mt-1 text-sm text-gray-500">Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
