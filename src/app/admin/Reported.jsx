
import { showToast } from '@/redux/Slices/ToastSlice';
import { getCookie } from '@/utils';
import { CheckCircle } from 'lucide-react';
import { TrashIcon, BanIcon } from 'lucide-react';
import nProgress from 'nprogress';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import PostViewModal from '@/components/Profile/PostViewModal';


const Reported = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectValue, setSelectValue] = useState('post')
    const [reports, setReports] = useState([])
    const [aiReported, setAiReported] = useState(false)
    const [postModalOpen, setPostModalOpen] = useState(false)
    const [postId, setPostId] = useState('')
    const [commentId, setCommentId] = useState(null)
    const [isReply, setIsReply] = useState(false)


    const handlePostModalOpen = (id,comment,isReply) => {
        setIsReply(isReply)
        setPostId(id)
        console.log(isReply)

        setPostModalOpen(!postModalOpen)
        setCommentId(comment)


    }
    
    const fetchReports = async ()=>{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reported/${selectValue}`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${getCookie('accessToken')}`
            }
        })
        const data = await response.json()
        if(response.ok){
            setReports(data)
        }
        
    }
    
    const filteredReports = ()=>{
        return reports.filter(report=>report.username.toLowerCase().includes(searchTerm.toLowerCase()))
    }


    

    useEffect(() => {


        fetchReports()


        
    }, [selectValue])


   

    
    return (
        <section className="relative overflow-x-auto h-96 overflow-y-auto border shadow-xl bg-muted/40 mt-16 rounded-lg">
            <div className="flex justify-between items-center p-3 sticky top-0 bg-muted/50 backdrop-blur-md backdrop-saturate-150 border   shadow-lg">
                <h2 className="text-xl font-semibold">Reported</h2>
                <input
                    type="text"
                    placeholder="Search Users..."
                    className="px-4 py-2 border-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectValue} onValueChange={(value)=>setSelectValue(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="report" />
                    </SelectTrigger>
                    <SelectContent className="bg-muted text-muted-foreground">
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="comment">Comment</SelectItem>
                        <SelectItem value="profile">Profile</SelectItem>
                    </SelectContent>
                </Select>

            </div>
            <table className="w-full text-sm text-left ">
                <thead className="text-xs uppercase sticky top-16 bg-muted">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Username</th>
                        <th scope="col" className="px-6 py-3">Reported</th>
                        <th scope="col" className="px-6 py-3">Reason</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReports().map((report, index) => (
                        <tr key={index} className="border-b">
                            <td className="px-6 py-4">{report.id}</td>
                            <td className="px-6 py-4 font-medium">
                                <Link to={`/profile/${report.username}`} className="text-blue-500 hover:underline">
                                    {report.username}
                                </Link>
                            </td>

                            <td className="px-6 py-4 cursor-pointer text-blue-500" onClick={()=>{handlePostModalOpen(selectValue==="post" ? report.id : report.post_id, selectValue==='comment'?report.id:null , selectValue==='comment'?report.reply:null)}}>
                         {
                            selectValue==='post' ?("show post"):selectValue==='comment' ?("show comment"):('show profile')
                         }
                            </td>
                        </tr>
                    ))}
                    {filteredReports().length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-4 text-center border">
                                No reports found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <PostViewModal open={postModalOpen} onClose={handlePostModalOpen} postid={postId} commentId={commentId} selectedTab={selectValue} replyStatus={isReply}/>
        </section>
    );
};

export default Reported;
