FullScreenMario.FullScreenMario.settings.scenes = {
    "cutscenes": {
		"Flagpole": {
			"firstRoutine": "StartSlidingDown",
			"routines": {
				"StartSlidingDown": FullScreenMario.Cutscenes.prototype.cutsceneFlagpoleStartSlidingDown,
				"HitBottom": FullScreenMario.Cutscenes.prototype.cutsceneFlagpoleHitBottom ,
				"Countdown": FullScreenMario.Cutscenes.prototype.cutsceneFlagpoleCountdown,
				"Fireworks": FullScreenMario.Cutscenes.prototype.cutsceneFlagpoleFireworks
			}
		},
		"BowserVictory": {
		    "firstRoutine": "CollideCastleAxe",
		    "routines": {
		        "CollideCastleAxe": FullScreenMario.Cutscenes.prototype.cutsceneBowserVictoryCollideCastleAxe,
		        "CastleBridgeOpen": FullScreenMario.Cutscenes.prototype.cutsceneBowserVictoryCastleBridgeOpen,
		        "BowserFalls": FullScreenMario.Cutscenes.prototype.cutsceneBowserVictoryBowserFalls,
		        "Dialog": FullScreenMario.Cutscenes.prototype.cutsceneBowserVictoryDialog
		    }
		}
	}
};
