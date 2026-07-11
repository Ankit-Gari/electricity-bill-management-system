import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, CreditCard } from "lucide-react"
import Link from "next/link"

export default function ViewBillPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Current Bill</h2>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Electricity Bill - April 2024</CardTitle>
              <CardDescription>Bill ID: BILL-10045-APR24</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Customer Details</h3>
                <div className="mt-1">
                  <p className="font-medium">John Smith</p>
                  <p>123 Main Street</p>
                  <p>Anytown, ST 12345</p>
                  <p>Connection ID: CID10045</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Bill Summary</h3>
                <div className="mt-1">
                  <p>Bill Date: April 5, 2024</p>
                  <p>Due Date: May 15, 2024</p>
                  <p>Billing Period: Mar 5 - Apr 4, 2024</p>
                  <p className="font-medium text-orange-500">Status: Unpaid</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Consumption Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Previous Reading</TableCell>
                    <TableCell className="text-right">5240 units</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Reading</TableCell>
                    <TableCell className="text-right">5490 units</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Consumption</TableCell>
                    <TableCell className="text-right font-medium">250 units</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Charges</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Energy Charges (250 units @ $0.42)</TableCell>
                    <TableCell className="text-right">$105.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fixed Charges</TableCell>
                    <TableCell className="text-right">$10.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax (8%)</TableCell>
                    <TableCell className="text-right">$9.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Amount</TableCell>
                    <TableCell className="text-right font-medium">$124.50</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/customer/pay-bill">
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
