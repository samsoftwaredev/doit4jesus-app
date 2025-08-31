import { formatDateSlash } from '../helpers';
import {
  normalizeAuthDB,
  normalizeEvent,
  normalizeEventMessages,
  normalizeFriendProfile,
  normalizeFriendsGroups,
  normalizeGroups,
  normalizeOnlineUsers,
  normalizePost,
  normalizeUserProfile,
  normalizeVideo,
} from './normalizers';

describe('normalizeEvent', () => {
  it('should normalize event data correctly', () => {
    const input = [
      {
        id: '1',
        attendees: { user1: true, user2: true },
        description: 'Event Description',
        event_type: 'youtube_video',
        picture_url: 'http://example.com/pic.jpg',
        price: 100,
        slug: 'event-slug',
        title: 'Event Title',
        created_at: '2023-01-01T00:00:00Z',
        started_at: '2023-01-01T01:00:00Z',
        updated_at: '2023-01-01T02:00:00Z',
        event_source: 'source',
      },
    ] as any;
    const expected = [
      {
        eventId: '1',
        attendees: 2,
        description: 'Event Description',
        eventType: 'youtubeVideo',
        pictureUrl: 'http://example.com/pic.jpg',
        price: 100,
        slug: 'event-slug',
        title: 'Event Title',
        createdAt: '2023-01-01T00:00:00Z',
        startedAt: '2023-01-01T01:00:00Z',
        updatedAt: '2023-01-01T02:00:00Z',
        eventSource: 'source',
      },
    ];
    expect(normalizeEvent(input)).toEqual(expected);
  });
});

describe('normalizeVideo', () => {
  it('should normalize video data correctly', () => {
    const input = [
      {
        id: '1',
        description: 'Video Description',
        video_id: 'video123',
        title: 'Video Title',
      },
    ] as any;
    const expected = [
      {
        videoEventId: '1',
        description: 'Video Description',
        videoId: 'video123',
        title: 'Video Title',
      },
    ];
    expect(normalizeVideo(input)).toEqual(expected);
  });
});

describe('normalizeUserProfile', () => {
  it('should normalize user profile data correctly', () => {
    const completedToday = new Date().toISOString();
    const updatedAt = new Date('2023-01-01T00:00:00Z').toISOString();
    const dateOfBirth = new Date('1990-01-01').toISOString();
    const inputProfile = {
      updated_at: updatedAt,
      id: 'user1',
      first_name: 'John',
      last_name: 'Doe',
      gender: 'male',
      birth_date: dateOfBirth,
      picture_url: 'http://example.com/pic.jpg',
    } as any;
    const inputRosaryStats = [
      {
        join_rosary_user_id: 'user1',
        completed_at: completedToday,
      },
    ] as any;
    const expected = {
      updateAt: formatDateSlash(updatedAt),
      userId: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      genderMale: true,
      dateOfBirth: formatDateSlash(dateOfBirth),
      pictureUrl: 'http://example.com/pic.jpg',
      stats: {
        rosaryTotalCount: 1,
        joinedRosary: [
          {
            userId: 'user1',
            date: formatDateSlash(completedToday),
          },
        ],
        todaysRosaryCompleted: true,
      },
    };
    expect(normalizeUserProfile(inputProfile, inputRosaryStats)).toEqual(
      expected,
    );
  });
});

describe('normalizeFriendProfile', () => {
  it('should normalize friend profile data correctly', () => {
    const input = [
      {
        id: 'user1',
        first_name: 'John',
        last_name: 'Doe',
        picture_url: 'http://example.com/pic.jpg',
        rosary_count: 10,
      },
    ];
    const expected = [
      {
        userId: 'user1',
        fullName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        pictureUrl: 'http://example.com/pic.jpg',
        rosaryCount: 10,
      },
    ];
    expect(normalizeFriendProfile(input)).toEqual(expected);
  });
});

describe('normalizeOnlineUsers', () => {
  it('should normalize online users data correctly', () => {
    const input = [
      {
        full_name: 'John Doe',
        userId: 'user1',
        picture_url: 'http://example.com/pic.jpg',
      },
    ];
    const expected = [
      {
        userId: 'user1',
        pictureUrl: 'http://example.com/pic.jpg',
        fullName: 'John Doe',
      },
    ];
    expect(normalizeOnlineUsers(input)).toEqual(expected);
  });
});

describe('normalizeEventMessages', () => {
  it('should normalize event messages data correctly', () => {
    const input = [
      {
        first_name: 'John',
        last_name: 'Doe',
        id: 'msg1',
        created_at: '2023-01-01T00:00:00Z',
        message: 'Hello World',
        updated_at: '2023-01-01T01:00:00Z',
        user_id: 'user1',
        deleted_at: null,
        event_id: 'event1',
        donation_amount: 100,
        event_messages_actions: {
          likes: 10,
          flagged: true,
        },
      },
    ] as any;
    const expected = [
      {
        firstName: 'John',
        lastName: 'Doe',
        id: 'msg1',
        createdAt: '2023-01-01T00:00:00Z',
        message: 'Hello World',
        updatedAt: '2023-01-01T01:00:00Z',
        userId: 'user1',
        deletedAt: null,
        eventId: 'event1',
        donationAmount: 1,
        replyId: undefined,
        likes: 10,
        flagged: true,
        isFlagged: true,
      },
    ];
    expect(normalizeEventMessages(input)).toEqual(expected);
  });
});

describe('normalizeAuthDB', () => {
  it('should normalize auth data correctly', () => {
    const input = {
      id: 'user1',
      email: 'user@example.com',
      confirmed_at: '2023-01-01T00:00:00Z',
    } as any;
    const expected = {
      id: 'user1',
      email: 'user@example.com',
      isConfirmed: true,
    };
    expect(normalizeAuthDB(input)).toEqual(expected);
  });
});

describe('normalizePost', () => {
  it('should normalize post data correctly', () => {
    const input = [
      {
        author: 'John Doe',
        content: { text: 'Post Content' },
        created_at: '2023-01-01T00:00:00Z',
        id: 'post1',
        keywords: ['keyword1', 'keyword2'],
        published_at: '2023-01-01T01:00:00Z',
        slug: 'post-slug',
        updated_at: '2023-01-01T02:00:00Z',
      },
    ] as any;
    const expected = [
      {
        author: 'John Doe',
        content: { text: 'Post Content' },
        createdAt: '2023-01-01T00:00:00Z',
        id: 'post1',
        keywords: ['keyword1', 'keyword2'],
        publishedAt: '2023-01-01T01:00:00Z',
        slug: 'post-slug',
        updatedAt: '2023-01-01T02:00:00Z',
      },
    ];
    expect(normalizePost(input)).toEqual(expected);
  });
});

describe('normalizeGroups', () => {
  it('should normalize group data correctly', () => {
    const input = [
      {
        created_at: '2023-01-01T00:00:00Z',
        group_name: 'Group Name',
        id: 'group1',
      },
    ] as any;
    const expected = [
      {
        createdAt: '2023-01-01T00:00:00Z',
        name: 'Group Name',
        id: 'group1',
      },
    ];
    expect(normalizeGroups(input)).toEqual(expected);
  });
});

describe('normalizeFriendsGroups', () => {
  it('should normalize friends group data correctly', () => {
    const input = [
      {
        uuid1: 'user1',
        is_favorite: true,
        created_at: '2023-01-01T00:00:00Z',
        uuid2: 'user2',
      },
    ] as any;
    const expected = [
      {
        uuid1: 'user1',
        isFavorite: true,
        createdAt: '2023-01-01T00:00:00Z',
        uuid2: 'user2',
      },
    ];
    expect(normalizeFriendsGroups(input)).toEqual(expected);
  });
});
