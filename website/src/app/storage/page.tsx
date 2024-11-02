'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Trash2 } from "lucide-react"

// Mock data structure
interface DataItem {
  id: string
  title: string
  description: string
  timestamp: string
  website: string
}

export default function DataTable() {
  const [data, setData] = useState<DataItem[]>([])
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function openDB() {
      return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open("highlightsDB", 1);

        request.onerror = (event) => {
          console.error("Database error:", event.target.errorCode);
          reject(event.target.errorCode);
        };

        request.onsuccess = (event) => {
          console.log("Database opened successfully");
          resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("highlights")) {
            db.createObjectStore("highlights", { keyPath: "id" });
          }
        };
      });
    }

    async function getAllHighlights(db: IDBDatabase) {
      return new Promise<DataItem[]>((resolve, reject) => {
        const transaction = db.transaction(["highlights"], "readonly");
        const store = transaction.objectStore("highlights");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = (event) => {
          resolve(event.target.result);
        };

        getAllRequest.onerror = (event) => {
          console.error("Error retrieving entries:", event.target.errorCode);
          reject(event.target.errorCode);
        };
      });
    }

    async function fetchHighlights() {
      try {
        const db = await openDB();
        const entries = await getAllHighlights(db);
        setData(entries);
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
      }
    }

    fetchHighlights();
  }, []);

  const filteredAndSortedData = useMemo(() => {
    console.log(data)
    return data
      .filter(item =>
        // item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.website.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime()
        const dateB = new Date(b.timestamp).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })
  }, [data, search, sortOrder])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleSort = (value: string) => {
    setSortOrder(value as 'asc' | 'desc')
  }

  const handleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleDelete = () => {
    // Delete selected items from IndexedDB
    const deleteFromDB = async (ids: string[]) => {
      const db = await openDB();
      const transaction = db.transaction(["highlights"], "readwrite");
      const store = transaction.objectStore("highlights");
      
      ids.forEach(id => {
        store.delete(id);
      });

      transaction.oncomplete = () => {
        console.log("All selected items deleted successfully!");
        setData(prev => prev.filter(item => !ids.includes(item.id)));
        setSelectedItems([]);
        setIsDeleteDialogOpen(false);
      };
    };

    deleteFromDB(selectedItems);
  }

  const truncateDescription = (description: string) => {
    const words = description.split(' ')
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...'
    }
    return description
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by title, website, or description"
            value={search}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Select onValueChange={handleSort}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedItems.length === 0}
        >
          Delete Selected
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedData.map(item => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                {/* <CardTitle className="truncate">{item.title }</CardTitle> */}
                <CardTitle className="truncate">{"titlee" }</CardTitle>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleSelect(item.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(item.timestamp).toLocaleString()}
              </p>
              <p className="text-sm mb-2">{truncateDescription(item.description)}</p>
            </CardContent>
            <CardFooter>
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline truncate w-full"
              >
                {item.website}
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the selected items? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
