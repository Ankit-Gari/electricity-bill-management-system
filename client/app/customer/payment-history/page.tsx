import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentHistoryPage() {
  // Sample payment history data
  const payments = [
    {
      id: 1,
      billId: "BILL-10045-MAR24",
      amount: 124.5,
      billMonth: "March 2024",
      paidOn: "2024-03-10",
      method: "Credit Card",
    },
    {
      id: 2,
      billId: "BILL-10045-FEB24",
      amount: 118.75,
      billMonth: "February 2024",
      paidOn: "2024-02-12",
      method: "Credit Card",
    },
    {
      id: 3,
      billId: "BILL-10045-JAN24",
      amount: 132.2,
      billMonth: "January 2024",
      paidOn: "2024-01-15",
      method: "Bank Transfer",
    },
    {
      id: 4,
      billId: "BILL-10045-DEC23",
      amount: 145.8,
      billMonth: "December 2023",
      paidOn: "2023-12-10",
      method: "Credit Card",
    },
    {
      id: 5,
      billId: "BILL-10045-NOV23",
      amount: 128.35,
      billMonth: "November 2023",
      paidOn: "2023-11-14",
      method: "Bank Transfer",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Payment History</h2>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>View all your past payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Billing Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid On</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.billId}</TableCell>
                  <TableCell>{payment.billMonth}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.paidOn}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Your payment statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Paid (2024)</p>
              <p className="text-2xl font-bold">$375.45</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Monthly Bill</p>
              <p className="text-2xl font-bold">$129.92</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">On-time Payments</p>
              <p className="text-2xl font-bold">100%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
