import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, retryPayment } = location.state || {};

  const handleRetryPayment = () => {
    if (retryPayment && typeof retryPayment === 'function') {
      retryPayment();
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl px-4 py-16 mx-auto">
        <Card className="max-w-2xl mx-auto text-center p-8">
          <div className="mb-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 mb-2">
            We couldn't process your payment. Please try again.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-8">
              Order ID: #{orderId}
            </p>
          )}

          <div className="w-full max-w-sm mx-auto mb-8">
            <img
              src="/payment-failed-illustration.svg"
              alt="Payment Failed"
              className="w-full h-auto"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="flex-1 max-w-[200px]"
              onClick={() => navigate('/orders-details')}
            >
              View Order Details
            </Button>
            <Button
              className="flex-1 max-w-[200px] bg-red-600 hover:bg-red-700"
              onClick={handleRetryPayment}
            >
              Retry Payment
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentFailure;