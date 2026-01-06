import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Buttons"
import { Plus, Tag } from "lucide-react"

const categories = [
    { name: "Work", color: "bg-blue-500", count: 12 },
    { name: "Personal", color: "bg-green-500", count: 8 },
    { name: "Urgent", color: "bg-red-500", count: 4 },
    { name: "Ideas", color: "bg-purple-500", count: 2 },
]

export default function CategoriesPage() {
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Organize your tasks with custom tags</p>
                </div>
                <Button className="gap-2 rounded-full">
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                    <Card key={category.name} className="overflow-hidden">
                        <div className={`h-2 ${category.color}`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                            <Tag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{category.count}</div>
                            <p className="text-xs text-muted-foreground">Active tasks in this category</p>
                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="w-full bg-transparent">
                                    Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full text-destructive">
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
