import { IPlayerStats } from "../playerStats/playerStats.model";

class PlayerStatsComparator{
    public compareByScore (player1: IPlayerStats, player2: IPlayerStats){
        if(player1.score > player2.score) return -1;
        if(player1.score < player2.score) return 1;
        return this.compareByGorinRank(player1, player2);
    }
    
    public compareByGorinRank(player1: IPlayerStats, player2: IPlayerStats){
        if(player1.gorinRank > player2.gorinRank) return -1;
        if(player1.gorinRank < player2.gorinRank) return 1;
        return this.compareByAdamovichRank(player1, player2);
    }
    
    public compareByAdamovichRank(player1: IPlayerStats, player2: IPlayerStats){
        if(player1.lastAdamovichRank > player2.lastAdamovichRank) return -1;
        if(player1.lastAdamovichRank < player2.lastAdamovichRank) return 1;
        return this.compareByBirthday(player1, player2);
    }
    
    public compareByBirthday(player1: IPlayerStats, player2: IPlayerStats){
        if(new Date(player1.birthday) > new Date(player2.birthday)) return -1;
        if(new Date(player1.birthday) < new Date(player2.birthday)) return 1;
        return this.compareByPlayerName(player1, player2);
    }
    
    public compareByPlayerName (player1: IPlayerStats, player2: IPlayerStats){
        if(player1.playerName > player2.playerName) return 1;
        if(player1.playerName < player2.playerName) return -1;
        return 0;
    }
}

export default PlayerStatsComparator



