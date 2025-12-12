import React from 'react';
import { Camera, Loader, MapPin, Phone, Globe, Linkedin, Github, Save, X, Edit, Calendar } from 'lucide-react';
import { User } from '../../contexts/AuthContext';

interface ProfileHeaderProps {
    user: User;
    isOwnProfile: boolean;
    isEditing: boolean;
    editForm: any;
    setEditForm: (form: any) => void;
    handleSaveProfile: () => void;
    handleStatusChange: (status: string) => void;
    children?: React.ReactNode;
    setIsEditing: (isEditing: boolean) => void;
    handleAvatarClick: () => void;
    handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    isUploadingAvatar: boolean;
}

export default function ProfileHeader({
    user,
    isOwnProfile,
    isEditing,
    editForm,
    setEditForm,
    handleSaveProfile,
    setIsEditing,
    handleAvatarClick,
    handleAvatarChange,
    fileInputRef,
    isUploadingAvatar,
    handleStatusChange,
    children
}: ProfileHeaderProps) {
    return (
        <>
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-blue-600 to-teal-600 relative">
                {isOwnProfile && (
                    <button className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors">
                        <Camera className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
                    <div className="relative">
                        <div
                            className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white ${isOwnProfile ? 'cursor-pointer group' : ''}`}
                            onClick={handleAvatarClick}
                        >
                            {isUploadingAvatar ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {isOwnProfile && (
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                            <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center" title="متاح للعمل">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <div className="flex-grow mt-4 md:mt-0 md:mr-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                {isEditing ? (
                                    <div className="space-y-4 mb-4">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-600 focus:outline-none"
                                            placeholder="الاسم"
                                        />
                                        <textarea
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            className="w-full text-gray-600 bg-gray-50 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="النبذة الشخصية"
                                            rows={3}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="رقم الهاتف"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.location}
                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="الموقع"
                                            />
                                            <input
                                                type="url"
                                                value={editForm.website}
                                                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="الموقع الإلكتروني"
                                            />
                                            <input
                                                type="url"
                                                value={editForm.linkedin}
                                                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="LinkedIn"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                                        <p className="text-gray-600 mb-4">{user.bio || 'لم يتم إضافة وصف بعد'}</p>

                                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>انضم في {new Date(user.created_at).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                            {user.location && (
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{user.location}</span>
                                                </div>
                                            )}
                                            {user.phone && (
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{user.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Social Links */}
                                        <div className="flex items-center space-x-4 mb-4">
                                            {user.website && (
                                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                    <Globe className="w-5 h-5" />
                                                </a>
                                            )}
                                            {user.social_links?.linkedin && (
                                                <a href={user.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                    <Linkedin className="w-5 h-5" />
                                                </a>
                                            )}
                                            {user.social_links?.github && (
                                                <a href={user.social_links.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {isOwnProfile && (
                                <div className="flex items-center space-x-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>حفظ</span>
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>إلغاء</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>تعديل الملف الشخصي</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {children}

                {/* Status */}
                <div className="flex items-center justify-between mt-6 border-t pt-4">
                    <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${user.status === 'online' ? 'bg-green-500' :
                            user.status === 'available' ? 'bg-blue-500' :
                                user.status === 'busy' ? 'bg-orange-500' : 'bg-gray-500'
                            }`}></div>
                        <span className="text-sm text-gray-600">
                            {user.status === 'online' ? 'متصل الآن' :
                                user.status === 'available' ? 'متاح للعمل' :
                                    user.status === 'busy' ? 'مشغول حالياً' : 'غير متصل'}
                        </span>
                    </div>

                    {isOwnProfile && (
                        <select
                            value={user.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="online">متصل</option>
                            <option value="available">متاح</option>
                            <option value="busy">مشغول</option>
                            <option value="offline">غير متصل</option>
                        </select>
                    )}
                </div>
            </div>
        </>
    );
}
