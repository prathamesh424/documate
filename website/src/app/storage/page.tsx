'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Query } from 'convex/server'
import { api } from '../../../convex/_generated/api'
import { Id } from 'convex/schema'
import { Table } from "@/components/ui/table"
import { formatDistanceToNow, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { Search, Square, SquareArrowOutUpRight, SquareCheckBigIcon, Trash2 } from "lucide-react"
import { query } from '../../../convex/_generated/server'
import { useMutation, useQuery } from 'convex/react'
import { Badge } from '@/components/ui/badge'
import { UserProfile ,useUser } from '@clerk/clerk-react'
// Mock data structure
interface DataItem {
  id: string
  title: string
  description: string
  timestamp: string
  website: string
}

export default function DataTable() {
  // const [data, setData] = useState<DataItem[]>([])
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const itemsPerPage = 20;
  const [selectedItems, setSelectedItems] = useState<Id<"highlights">[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const instance = useUser()
  // const user_email =useUser().user.emailAddresses[0].emailAddress
  const user_email = instance.user && instance.user.emailAddresses && instance.user.emailAddresses[0].emailAddress
  const data = useQuery(api.highlights.getHighlights, {id: user_email  });
  const deleteHighlightMutation = useMutation(api.highlights.deleteHighlights);
  const paginatedData = data ? data
  .filter(item =>
    item.website.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  }).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage):[]

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }
  const formatCreationTime = (timestamp) => {
    const creationDate = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - creationDate) / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) {
      return formatDistanceToNow(creationDate, { addSuffix: true });
    } else {
      return format(creationDate, 'dd MMM yyyy');
    }
  };
  const selectAll = () => {
    if(isSelectAll){
      setSelectedItems([])
      setSelectedItems(data ? data.map(item => item._id as Id<"highlights">) : [])
      }
    else{
      setSelectedItems(data?data.map(item => item._id):[])
    }
    setIsSelectAll(!isSelectAll)
  }

  const handleSort = (value: string) => {
    setSortOrder(value as 'asc' | 'desc')
  }

  const handleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleDelete = async () => {
    // Delete selected items from IndexedDB
    const deleted = await deleteHighlightMutation({ids: selectedItems})
    setSelectedItems([])
    setIsDeleteDialogOpen(false)
  }

  const truncateDescription = (description: string) => {
    const words = description.split(' ')
    const letters = description.split('')
    if (letters.length > 60) {
      return letters.slice(0, 60).join('') + '...'
    }
    return description
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 ">
        <div className="bg-white relative w-full md:w-1/3 ">
          <Search className="absolute left-2 top-1/2 transform  -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by title, website, or description"
            value={search}
            onChange={handleSearch}
            className="pl-10 bg-white"
          />
        </div>
        <Select  onValueChange={handleSort}>
          <SelectTrigger className="w-full md:w-[180px] bg-white">
            <SelectValue  placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent  className="bg-white">
            <SelectItem className="text-black" value="desc">Newest first</SelectItem>
            <SelectItem className="text-black"  value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
        {
          selectedItems.length > 0 && (
            <Button 
            onClick={selectAll}
            className="flex items-center space-x-2 border">
              {!isSelectAll? <Square className='text-black h-4'/> : <SquareCheckBigIcon className='text-black h-4'/>}
              <span> Select All</span>
            </Button>
          )
        }
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedItems.length === 0}
        >
               <div className="flex items-center space-x-2">

              <Trash2 className="text-white" />
              <span>Delete Selected</span>
              {/* <span>{selectedItems.length} selected</span> */}
            </div>
        </Button>
      </div>

     {data&& data.length ?
      <>
      <Table className="w-[90vw] divide-y z-[0] divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6/12">Description</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Creation Time</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Source</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map(item => (
            <tr key={item._id}>
             
              <td className="px-6 py-4 whitespace-nowrap ">
                <div className="text-sm text-gray-900 truncate ">
                <Checkbox
                className='border border-3xl shadow mr-2'
                  checked={selectedItems.includes(item._id)}
                  onCheckedChange={() => handleSelect(item._id)}
                />
                  <Badge className="ml-2">{item.title}</Badge>
                  </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                            <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    {/* {truncateDescription(item.description)} */}
                      <Button variant="ghost" className='hover:bg-white hover:text-black'>{truncateDescription(item.description)}</Button>
                    </TooltipTrigger>
                    <TooltipContent className='bg-white'>
                      <div className='bg-white text-black' style={{ width: '300px', overflowWrap: 'break-word', whiteSpace: 'normal' }}>
                        {item.description}
                      </div>
                    </TooltipContent>


                  </Tooltip>
                </TooltipProvider>
                            </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatCreationTime(item._creationTime)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-black hover:underline truncate w-full">
                  <SquareArrowOutUpRight />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil( data?data
    .filter(item =>
      item.website.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }).length / itemsPerPage : 0)}
        onPageChange={handlePageChange}
      />
    </>
    :
    <div className="flex justify-center items-center h-96 w-[90vw]">
      <p className="text-gray-500">No data available</p>
      </div>}

      <Dialog open={isDeleteDialogOpen}  onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the selected items? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className='border border-lg' onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 mx-1 border ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};
