import { cookies } from 'next/headers';

export async function check_auth(db: any, db_query: any): Promise<{ userid: string, userlevel: number, usertier: number, isadmin: boolean }> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  const sessionInfo = {
    userid: '',
    userlevel: 0,
    usertier: 0,
    isadmin: false
  };

  if (!sessionId) {
    return sessionInfo;
  }

  // SQLite is case-insensitive for identifiers, but use standard column names (no quotes, correct names)
  const session = await db_query(db, 'SELECT userid FROM usersession WHERE sessiontoken = ?', [sessionId]);
  if (session.length > 0) {
    sessionInfo.userid = session[0].userid;

    // In your Users table, the primary key is userid, and there is no IsAdmin column, but UserLevel (2 = admin)
    const user = await db_query(db, 'SELECT userlevel, usertier FROM users WHERE userid = ?', [session[0].userid]);
    if (user.length > 0) {
      sessionInfo.userlevel = user[0].userlevel;
      sessionInfo.isadmin = user[0].userlevel === 2;
      sessionInfo.usertier = user[0].usertier;
    }
  }
  return sessionInfo;
}
