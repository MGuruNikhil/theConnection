import { Card, CardContent } from "@/components/ui/card"

const PageNotFound = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card>
                <CardContent className="flex items-center p-6">
                    <span className="border-r px-4 text-3xl font-black text-primary">404</span>
                    <span className="px-4 text-muted-foreground">This page could not be found</span>
                </CardContent>
            </Card>
        </div>
    )
}

export default PageNotFound;
