'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
// import { stockService } from "@/services/stockService";
import { useStockService } from "@/hooks/useStockService";
import { Metadata } from "next";

interface StockDayData {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
}

interface StockValues {
    [date: string]: StockDayData;
}

// export const metadata: Metadata = {
//   title: 'Stock Info',
// };

export default function StockInfo() {
    const { id: stockId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stockData, setStockData] = useState<unknown>({});
    const stockService = useStockService();

    const [stockValues, setStockValues] = useState<StockValues>({});

    const fetchStockData = async () => {
        if (!stockId) return;
        setLoading(true);
        const response = await stockService.get("" + stockId);
        // const data = await response.json();
        setStockValues(response['Time Series (Daily)']);
        setLoading(false);
        return response;
    }

    useEffect(() => {
        if (!stockId || stockId.length == 0) {
            router.replace('/stocks');
            return;
        }

        try {
            const data = fetchStockData();
            if (data) {
                setStockData(data);
            }
        } catch (err) {
            console.log(err);
        }


    }, [stockId])

    return (
        <div className="bg-gray-100 p-4">
            {loading ? <div>Loading...</div> :
                <div>
                    <div className="w-ful flex space-between align-center gap-6 py-4">
                        <a href="/stocks" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</a>
                        <h1 className="text-3xl">Stock Info for {stockId}</h1>
                    </div>
                    <div className="w-full rounded overflow-hidden shadow-lg bg-white ">
                        <div className="card-body">
                            <table className="table table-striped w-full">
                                <thead>
                                    <tr className="m-3">
                                        <th scope="col" className="p-4">Date</th>
                                        <th scope="col" className="p-4">Open</th>
                                        <th scope="col" className="p-4">High</th>
                                        <th scope="col" className="p-4">Low</th>
                                        <th scope="col" className="p-4">Close</th>
                                        <th scope="col" className="p-4">Volume</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(stockValues).map((date: string) => (
                                        <tr key={date}>
                                            <td className="px-4 py-2">{date}</td>
                                            <td className="px-4 py-2">{stockValues[date]['1. open']}</td>
                                            <td className="px-4 py-2">{stockValues[date]['2. high']}</td>
                                            <td className="px-4 py-2">{stockValues[date]['3. low']}</td>
                                            <td className="px-4 py-2">{stockValues[date]['4. close']}</td>
                                            <td className="px-4 py-2">{stockValues[date]['5. volume']}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}